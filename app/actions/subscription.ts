'use server';

import { createClient } from '@/app/utils/supabase/server';
import Stripe from 'stripe';
import { SubscriptionItem } from '../types/Database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createStripeCustomer(id: string, email: string, name: string) {
  const supabase = await createClient();
  const customer = await stripe.customers.create({ email, name });

  // Customer ID in Supabase speichern
  await supabase.from('user').update({ stripe_customer_id: customer.id }).eq('id', id);

  return customer.id;
}

export async function createSubscription(
  customerId: string,
  pricePerMonth: number, // in Cent, z.B. 2900 = 29€
  description: string,
  startDate?: number
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          recurring: { interval: 'month' },
          unit_amount: pricePerMonth,
          product_data: {
            name: description,
          },
        },
      },
    ],
    subscription_data: {
      billing_cycle_anchor: startDate, // ← Startdatum
      proration_behavior: 'none',
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  });

  return session.url ?? '';
}

export async function subscriptionsGetForUser(id: string): Promise<SubscriptionItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('subscription_item')
    .select('*')
    .eq('user', id)
    .order('date_start', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}
