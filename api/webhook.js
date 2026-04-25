const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expected !== signature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (req.body.event !== 'payment_link.paid') {
    return res.status(200).json({ ok: true });
  }

  const payment = req.body.payload.payment_link.entity;
  const email = payment.customer?.email || payment.email_id;
  const amount = payment.amount;

  let plan = 'free';
  if (amount === 19900) plan = 'growth';
  else if (amount === 199900) plan = 'elite';

  if (!email || plan === 'free') {
    return res.status(200).json({ ok: true });
  }

  const { error } = await supabase
    .from('profiles')
    .update({ plan })
    .eq('email', email);

  if (error) {
    return res.status(500).json({ error: 'DB update failed' });
  }

  return res.status(200).json({ ok: true, plan, email });
}
