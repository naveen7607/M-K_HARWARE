# Deployment Guide

## 1. MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow access from your backend host or use `0.0.0.0/0` only if your deployment platform requires it.
4. Copy the connection string into `MONGODB_URI`.

## 2. Backend on Render or Railway

Use `apps/api` as the service root.

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start
```

Required environment variables:

- `NODE_ENV=production`
- `PORT`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_URL`
- `GOOGLE_CLIENT_ID`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_VERIFY_SERVICE_SID`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `OPENAI_API_KEY`

## 3. Frontend on Vercel

Use `apps/web` as the project root.

Required environment variables:

- `NEXT_PUBLIC_API_URL=https://your-api-domain.com/api`
- `NEXT_PUBLIC_SHOP_PHONE`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL`

## 4. Production Checklist

- Replace all example secrets with long random values.
- Enable HTTPS-only cookies by setting `NODE_ENV=production`.
- Configure Twilio Verify for mobile OTP.
- Configure SMTP for reset links and inquiry confirmations.
- Add the real Google Map embed URL for the shop.
- Add your final product photos and real SKUs before launch.
- Create the first owner/admin user directly in MongoDB or promote a registered user by setting `role: "admin"`.
