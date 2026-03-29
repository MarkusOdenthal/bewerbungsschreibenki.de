import express from 'express';
import nodemailer from 'nodemailer';

const app = express();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.strato.de',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.get('/health', (_req, res) => res.send('ok'));

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;
    if (customerEmail) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: customerEmail,
        subject: `Your ${process.env.PRODUCT_NAME || 'purchase'} is ready!`,
        html: `
          <h1>Thank you for your purchase!</h1>
          <p>Click the link below to access your download:</p>
          <p><a href="${process.env.DOWNLOAD_URL}">Download here</a></p>
        `
      });
    }
  }

  res.json({ received: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Webhook server running on port ${process.env.PORT || 3000}`);
});
