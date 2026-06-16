'use client';

import { Client, Invoice, InvoiceItem, User } from '@/app/types/Database';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import {
  invoiceItemCreate,
  invoiceItemDelete,
  invoiceItemsLoad,
  invoiceItemUpdate,
} from '@/app/actions/invoiceitem';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { invoiceUpdate } from '@/app/actions/invoice';
import { OverlayPanel } from 'primereact/overlaypanel';
import { tax_rates } from '@/app/constants/Constants';
import DividerBlock from '../../DividerBlock';
import { formatCurrency } from '@/app/utils/formats';
import { Calendar } from 'primereact/calendar';
import { DatePicker, SelectLabel } from '../../forms/FormElements';
import { Dialog } from 'primereact/dialog';
import InvoicePreview from './InvoicePreview';

interface Props {
  clients: User[];
  invoice: Invoice;
  onSubmit: () => void;
}

export default function InvoiceEditor({ clients, invoice, onSubmit }: Props) {
  const [previewing, setPreviewing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const op = useRef<OverlayPanel | null>(null);

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(null);
  const [invoiceRecipient, setInvoiceRecipient] = useState('');
  const [invoiceTaxAmount, setInvoiceTaxAmount] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [invoiceTotalNet, setInvoiceTotalNet] = useState(0);
  const [taxRate, setTaxRate] = useState(0);

  const grossTotal = items.reduce((sum, item) => sum + item.price_total, 0);
  const netTotal = grossTotal / (1 + taxRate / 100);
  const taxAmount = grossTotal - netTotal;

  useEffect(() => {
    if (!invoice) return;

    if (invoice) {
      setInvoiceNumber(invoice.invoice_number);
      setInvoiceDate(invoice.invoice_date);
      setInvoiceRecipient(invoice.recipient);
      setInvoiceTotal(invoice.invoice_total_gross);
      setInvoiceTotalNet(invoice.invoice_total_net);
      setTaxRate(invoice.tax_rate);
    }

    const fetchItems = async () => {
      try {
        const res = await invoiceItemsLoad(invoice.id);
        setItems(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, [invoice]);

  const addItem = async () => {
    const payload = {
      index: items.length + 1,
      invoice: invoice.id,
      quantity: 0,
      price_single: 0,
      price_total: 0,
    };

    try {
      await invoiceItemCreate(payload);
    } catch (err) {
      console.error(err);
    } finally {
      updateItems();
    }
  };

  const clientTemplate = (client: User) => (
    <span>
      {client.user_name_last}, {client.user_name_first}
    </span>
  );

  const deleteItem = async (id: string) => {
    try {
      await invoiceItemDelete(id);
    } catch (err) {
      console.error(err);
    }
    updateItems();
  };

  const deleteTemplate = (rowData: InvoiceItem) => (
    <Button
      className="button-square"
      icon="pi pi-trash"
      style={{ color: 'red' }}
      text
      onClick={() => deleteItem(rowData.id)}
    />
  );

  const descriptionEditTemplate = (rowData: InvoiceItem) => (
    <InputText
      onChange={(e) => updateItem(rowData.id, 'description', e.target.value)}
      value={rowData.description || ''}
    />
  );

  const quantityEditTemplate = (rowData: InvoiceItem) => (
    <InputNumber
      onChange={(e) => updateItem(rowData.id, 'quantity', e.value || 0)}
      value={rowData.quantity || 0}
    />
  );

  const priceTotalTemplate = (rowData: InvoiceItem) => (
    <span>{formatCurrency(rowData.price_total)}</span>
  );

  const priceSingleEditTemplate = (rowData: InvoiceItem) => (
    <InputNumber
      currency="EUR"
      locale="de-DE"
      mode="currency"
      onChange={(e) => updateItem(rowData.id, 'price_single', e.value || 0)}
      value={rowData.price_single || 0}
    />
  );

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.price_total = updated.quantity * updated.price_single;
        return updated;
      })
    );
  };

  const updateItems = async () => {
    const res = await invoiceItemsLoad(invoice.id);
    setItems(res);
  };

  const updateInvoice = async () => {
    setUpdating(true);
    const invoicePayload = {
      invoice_date: invoiceDate || new Date(),
      invoice_number: invoiceNumber,
      invoice_total_gross: grossTotal,
      invoice_total_net: netTotal,
      recipient: invoiceRecipient,
      tax_amount: taxAmount,
      tax_rate: taxRate,
    };

    try {
      await invoiceUpdate(invoicePayload, invoice.id);
      await Promise.all(
        items.map((item) =>
          invoiceItemUpdate(
            {
              description: item.description,
              quantity: item.quantity,
              price_single: item.price_single,
              price_total: item.price_total,
              taxes_amount: item.price_total * taxRate,
            },
            item.id
          )
        )
      );
      setInvoiceTaxAmount(taxAmount);
      setInvoiceTotal(grossTotal);
      setInvoiceTotalNet(netTotal);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
      onSubmit();
    }
  };

  return (
    <div className="column gap-m">
      <Dialog
        contentClassName="previewer"
        draggable={false}
        header="Vorschau"
        onHide={() => setPreviewing(false)}
        style={{ maxHeight: '80vh', maxWidth: 850, width: '100%' }}
        visible={previewing}
      >
        <InvoicePreview client={invoiceRecipient} invoice={invoice} invoiceItems={items} />
      </Dialog>
      <div className="grid columns-two gap-m mobile-column">
        <div className="column gap-xs">
          <label>Rechnungsnummer</label>
          <InputText onChange={(e) => setInvoiceNumber(e.target.value)} value={invoiceNumber} />
        </div>
        <div className="column gap-xs">
          <label>Empfänger</label>
          <Dropdown
            filter
            filterPlaceholder="Kunde suchen..."
            itemTemplate={clientTemplate}
            onChange={(e) => setInvoiceRecipient(e.value)}
            optionValue="id"
            options={clients}
            value={invoiceRecipient}
            valueTemplate={
              invoiceRecipient
                ? clientTemplate(clients.find((c) => c.id === invoiceRecipient)!)
                : 'Empfänger auswählen'
            }
          />
        </div>
        <div className="column gap-xs">
          <label>Steuersatz</label>
          <Dropdown onChange={(e) => setTaxRate(e.value)} options={tax_rates} value={taxRate} />
        </div>
        <DatePicker
          label="Rechnungsdatum"
          onDateChange={setInvoiceDate}
          dateValue={invoiceDate || new Date()}
        />
      </div>
      <DividerBlock height={0.5} />
      <div className="column">
        <div className="row space-between">
          <h5>Zwischensumme</h5>
          <h5>{formatCurrency(netTotal)}</h5>
        </div>
        <div className="row space-between">
          <h5>Steuern ({taxRate}%)</h5>
          <h5>{formatCurrency(taxAmount)}</h5>
        </div>
        <div className="row space-between">
          <h4>Gesamtbetrag</h4>
          <h4>{formatCurrency(grossTotal)}</h4>
        </div>
      </div>
      <DividerBlock height={0.5} />
      <div className="row space-between">
        <h4>Posten</h4>
        <Button className="button-round" icon="pi pi-plus" onClick={addItem} text />
      </div>
      <DataTable emptyMessage="Keine Posten gefunden" value={items}>
        <Column field="index" header="#" />
        <Column body={descriptionEditTemplate} header="Beschreibung" />
        <Column body={quantityEditTemplate} header="Menge" />
        <Column body={priceSingleEditTemplate} header="Einzelpreis" />
        <Column body={priceTotalTemplate} header="Gesamtpreis" />
        <Column body={deleteTemplate} header="Aktionen" />
      </DataTable>
      <div className="row gap-s">
        <Button
          className="button-primary"
          disabled={updating || !invoiceNumber || !taxRate || !invoiceRecipient}
          icon={updating ? 'pi pi-spinner' : undefined}
          label="Änderungen speichern"
          onClick={updateInvoice}
          style={{ width: 'fit-content' }}
        />
        <Button
          className="button-primary"
          label="Vorschau"
          onClick={() => setPreviewing(true)}
          style={{ width: 'fit-content' }}
        />
      </div>
    </div>
  );
}
