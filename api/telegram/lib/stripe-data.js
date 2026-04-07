// Stripe data collection for Telegram reports
// Fetches real payment amounts and subscription statuses from Stripe

import Stripe from 'stripe';

export async function collectStripeData(orders) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return { available: false, error: 'STRIPE_SECRET_KEY not configured' };
  }

  const stripe = new Stripe(stripeKey);

  try {
    // Separate orders by type
    const oneTimeOrders = orders.filter(o => o.pack !== 'daily-push');
    const dailyPushOrders = orders.filter(o => o.pack === 'daily-push');

    // Fetch Stripe data in parallel
    const [oneTimeAmounts, subscriptionData] = await Promise.all([
      fetchOneTimeAmounts(stripe, oneTimeOrders),
      fetchSubscriptionData(stripe, dailyPushOrders),
    ]);

    return {
      available: true,
      oneTimeAmounts,    // Map of order.id -> { amountReceived, currency }
      subscriptions: subscriptionData, // Map of order.id -> { status, totalPaid, daysPaid }
    };
  } catch (err) {
    console.error('Stripe data collection error:', err.message);
    return { available: false, error: err.message };
  }
}

// Fetch real amounts from Stripe payment intents for one-time orders
async function fetchOneTimeAmounts(stripe, orders) {
  const amounts = {};

  await Promise.all(orders.map(async (order) => {
    if (!order.stripe_payment_intent) return;
    try {
      const pi = await stripe.paymentIntents.retrieve(order.stripe_payment_intent);
      amounts[order.id] = {
        amountReceived: pi.amount_received || 0,
        currency: pi.currency || 'usd',
      };
    } catch (err) {
      // Fallback to stored amount
      amounts[order.id] = {
        amountReceived: order.amount || 0,
        currency: order.currency || 'usd',
      };
    }
  }));

  return amounts;
}

// Fetch subscription statuses and invoice totals from Stripe
async function fetchSubscriptionData(stripe, orders) {
  const data = {};

  await Promise.all(orders.map(async (order) => {
    const subscriptionId = order.stripe_payment_intent;
    if (!subscriptionId) {
      // Try to get subscription ID from checkout session
      if (order.stripe_session_id) {
        try {
          const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
          if (session.subscription) {
            return await fetchSingleSubscription(stripe, order.id, session.subscription, data);
          }
        } catch (_) {}
      }
      data[order.id] = { status: 'unknown', totalPaid: 0, daysPaid: 0 };
      return;
    }

    await fetchSingleSubscription(stripe, order.id, subscriptionId, data);
  }));

  return data;
}

async function fetchSingleSubscription(stripe, orderId, subscriptionId, data) {
  let status = 'unknown';

  // Get subscription status
  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    status = sub.status; // active, canceled, past_due, unpaid, etc.
  } catch (err) {
    if (err.code === 'resource_missing') {
      status = 'canceled';
    }
  }

  // Get total paid from invoices
  let totalPaid = 0;
  let daysPaid = 0;
  try {
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
      status: 'paid',
      limit: 100,
    });
    totalPaid = invoices.data.reduce((sum, inv) => sum + inv.amount_paid, 0);
    daysPaid = invoices.data.length;
  } catch (_) {}

  data[orderId] = { status, totalPaid, daysPaid };
}
