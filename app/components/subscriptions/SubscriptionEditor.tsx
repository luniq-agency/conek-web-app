import {
  createStripeCustomer,
  createSubscription,
  subscriptionsGetForUser,
} from '@/app/actions/subscription';
import { Subscription, SubscriptionItem, User } from '@/app/types/Database';
import { useEffect, useRef, useState } from 'react';
import { DatePicker, NumberInputLabel, SelectLabel, TextInputLabel } from '../forms/FormElements';
import Column from '../layout/Column';
import { Column as TableColumn } from 'primereact/column';
import { Button } from 'primereact/button';
import Row from '../layout/Row';
import DividerBlock from '../DividerBlock';
import SubscriptionItems from './SubscriptionItem';
import { DataTable } from 'primereact/datatable';
import { formatCurrency, formatDate, formatDateMonthYear } from '@/app/utils/formats';
import { invoice_status } from '@/app/constants/Constants';
import Tag from '../ui/Tag';
import { Dialog } from 'primereact/dialog';
import { CurrencyInput } from '../forms/CurrencyInput';
import { Toast } from 'primereact/toast';
import { subscriptionsLoad } from '@/app/actions/subscriptions/subscriptions';
import { invoiceLoadLatest } from '@/app/actions/invoice';

interface Props {
  user: User;
}

export default function SubscriptionEditor({ user }: Props) {
  const toast = useRef<Toast | null>(null);
  const [visible, setVisible] = useState(false);

  //DATA
  const [plans, setPlans] = useState<Subscription[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);

  // INPUTS
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [subEnd, setSubEnd] = useState<Date | undefined>(undefined);
  const [subName, setSubName] = useState('');
  const [subPrice, setSubPrice] = useState(0);
  const [subStart, setSubStart] = useState<Date | undefined>(undefined);

  const fetchData = async () => {
    const res = await subscriptionsGetForUser(user.id);
    if (res.length === 0) return;
    setSubscriptions(res);
    const firstSub = res[0];
    const nextDay = new Date(firstSub.date_end);
    nextDay.setDate(nextDay.getDate() + 1);
    setNewDate(nextDay);
    setSubEnd(firstSub.date_end);
    setSubName(firstSub.name || '');
    setSubPrice(firstSub.amount_total || 0);
  };

  useEffect(() => {
    console.log('User:', user);
    if (!user) return;
    const fetchData = async () => {
      const [res, subRes] = await Promise.all([
        subscriptionsGetForUser(user.id),
        subscriptionsLoad(),
      ]);
      setPlans(subRes);
      if (res.length === 0) return;
      setSubscriptions(res);
      const firstSub = res[0];
      const nextDay = new Date(firstSub.date_end);
      nextDay.setDate(nextDay.getDate() + 1);
      setNewDate(nextDay);

      setSubEnd(firstSub.date_end);
      setSubName(firstSub.name || '');
      setSubPrice(firstSub.amount_total || 0);
    };
    fetchData();
  }, [user]);

  // CHECKS
  const hasSub = subscriptions.length >= 1;

  // TEMPLATES
  const monthTemplate = (rowData: SubscriptionItem) => {
    return <span>{formatDateMonthYear(rowData.date_start)}</span>;
  };

  const priceTemplate = (rowData: SubscriptionItem) => {
    return <span>{formatCurrency(rowData.amount_total)}</span>;
  };

  const statusTemplate = (rowData: SubscriptionItem) => {
    const status = invoice_status.find((i) => i.value === rowData.status);
    return (
      <Tag
        bgColor={status?.bg || 'grey'}
        color={status?.color || 'black'}
        text={status?.label || ''}
      />
    );
  };

  const startSubscription = async () => {
    if (!selectedSubscription) return;
    const plan = plans.find((p) => p.id === selectedSubscription);

    if (!plan) return;
    const priceInCents = plan?.amount_total * 100;
    let customerId = user.stripe_customer_id;

    const startTimestamp = subStart ? Math.floor(subStart.getTime() / 1000) : undefined;
    try {
      if (!customerId) {
        const newCustomerId = await createStripeCustomer(
          user.id,
          user.email,
          `${user.user_name_first} ${user.user_name_last}`
        );
        if (!newCustomerId) throw new Error('Stripe Customer konnte nicht erstellt werden');
        customerId = newCustomerId;
      }

      await createSubscription(customerId, plan.stripe_id, user.id, startTimestamp);
      fetchData();
      toast.current?.show({
        severity: 'success',
        summary: 'Abo erstellt',
        detail: 'Das Abo wurde erstellt.',
      });
      setVisible(false);
    } catch (err) {
      console.error(err);
      toast.current?.show({
        severity: 'success',
        summary: 'Fehler',
        detail: 'Das Abo konnte nicht erstellt werden. Bitte probieren Sie es erneut.',
      });
    }
  };

  return (
    <Column>
      <Toast ref={toast} />
      <Dialog
        draggable={false}
        header="Abo bearbeiten"
        onHide={() => setVisible(false)}
        style={{ maxWidth: 480 }}
        visible={visible}
      >
        <Column>
          <SelectLabel
            label="Abo auswählen"
            onChange={setSelectedSubscription}
            optionLabel="name"
            optionValue="id"
            options={plans}
            value={selectedSubscription}
          />
          {/* <CurrencyInput label="Preis" onChange={setSubPrice} value={subPrice} />*/}
          {!hasSub && (
            <DatePicker label="Startdatum" dateValue={subStart} onDateChange={setSubStart} />
          )}
          <Column gap={4}>
            <Button
              disabled={!selectedSubscription || !subStart}
              label={hasSub ? 'Aktualisieren' : 'Abo starten'}
              onClick={startSubscription}
            />
            {hasSub && (
              <span className="text-s">
                Das Abo wird ab dem {formatDate(newDate || '')} zu einem Preis von{' '}
                {formatCurrency(subPrice)} fortgesetzt.
              </span>
            )}
          </Column>
        </Column>
      </Dialog>
      <Row justifyContent="space-between">
        <h3>Abonnement</h3>
        <Button
          label={hasSub ? 'Abo bearbeiten' : 'Abo anlegen'}
          onClick={() => setVisible(true)}
        />
      </Row>
      <DividerBlock height={0.5} />
      <h4>Zahlungshistorie</h4>
      <DataTable value={subscriptions}>
        <TableColumn body={monthTemplate} header="Monat" />
        <TableColumn body={statusTemplate} header="Status" />
        <TableColumn body={priceTemplate} header="Preis" />
      </DataTable>
    </Column>
  );
}
