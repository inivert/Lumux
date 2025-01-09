# Project Structure

## Root Directory
```
.
├── .env
├── .env.local
├── .env.production
├── .dockerignore
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── .nvmrc
├── .prettierrc
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## Source Code (`/src`)

### App Router Structure
```
src/app/
├── (auth)
│   └── layout.tsx
├── (site)
│   ├── admin/
│   ├── auth/
│   ├── dashboard/
│   ├── error/
│   ├── support/
│   ├── thank-you/
│   ├── user/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
└── api/
    ├── admin/
    ├── auth/
    ├── health/
    ├── stripe/
    └── user/
```

### Components Structure
```
src/components/
├── 404/
├── Admin/
│   ├── AiIntegration/
│   ├── Dashboard/
│   ├── SendNewsletter/
│   └── Users/
├── Auth/
├── Common/
│   ├── Dashboard/
│   └── Modals/
├── Footer/
├── Header/
├── Home/
│   ├── CallToAction/
│   ├── Counter/
│   ├── FAQ/
│   ├── Features/
│   ├── FeaturesWithImage/
│   ├── Hero/
│   ├── Newsletter/
│   ├── Pricing/
│   └── Testimonials/
├── Support/
├── User/
│   ├── AccountSettings/
│   ├── Api/
│   ├── Billing/
│   └── PurchaseHistory/
└── ui/
```

### Core Functionality
```
src/
├── actions/
├── emails/
├── libs/
├── pricing/
├── staticData/
├── stripe/
├── styles/
└── types/
```

## Database
```
prisma/
├── migrations/
└── schema.prisma
```

## Public Assets
```
public/
├── images/
│   ├── blog/
│   ├── cta/
│   ├── dashboard/
│   ├── features/
│   ├── footer/
│   ├── hero/
│   ├── icon/
│   ├── logo/
│   ├── pricing/
│   ├── signin/
│   ├── support/
│   └── testimonial/
└── styles/
```

## Scripts
```
scripts/
└── setup-env.sh
```

## Key Features
- Next.js 13+ with App Router
- TypeScript Integration
- Authentication System
- Stripe Payment Integration
- Admin & User Dashboards
- Email Functionality (Resend)
- Prisma ORM
- Tailwind CSS
- Docker Support
- Vercel Deployment
- Custom Font Integration (Satoshi)
- Environment Configuration
- API Routes & Middleware 