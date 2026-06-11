# M/S Manikyam Agriculture Hardware, Electrical & Cement

A production-ready full-stack website for a local hardware, electrical, cement, and agriculture supplies shop. The project is organized as a small monorepo with:

- `apps/web`: Next.js 15, React, TypeScript, Tailwind CSS, ShadCN-style components, Framer Motion.
- `apps/api`: Node.js, Express, TypeScript, MongoDB Atlas, JWT auth, OTP flow, admin APIs, AI assistant endpoints.
- `docs/deployment.md`: Deployment and environment setup guide.

## Quick Start

```bash
npm install
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
npm run dev
```

The frontend runs at `http://localhost:3000` and the API runs at `http://localhost:5001`.

## Main Features

- Modern home page with banner, call, WhatsApp, featured categories, reviews, contact, and map.
- Product catalog with search, filters, sorting, pagination, details, and inquiry actions.
- Customer registration, email login, Google-login endpoint support, mobile OTP flow, and forgot-password APIs.
- Customer dashboard with profile, inquiries, wishlist, and invoice placeholders.
- Admin dashboard with analytics cards, sales/category/customer charts, low-stock alerts, and inventory controls.
- REST APIs for auth, products, categories, inventory, inquiries, reviews, notifications, analytics, and AI.
- MongoDB schemas for users, products, categories, inquiries, inventory, notifications, and reviews.
- Security middleware for JWT, hashing, rate limiting, validation, Helmet, CORS, secure cookies, and CSRF token support.

## Notes

Third-party services are optional in local development. If Twilio, email, or OpenAI credentials are not configured, the API uses safe development fallbacks so the app can still be tested.
