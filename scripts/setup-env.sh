#!/bin/bash

# Generate random password
POSTGRES_PASSWORD=$(openssl rand -base64 12)

# Database configuration
POSTGRES_USER=user
POSTGRES_DB=codelumus
DATABASE_URL=postgresql://user:\${POSTGRES_PASSWORD}@db:5432/codelumus?schema=public

# Generate a random secret for NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Create .env file
cat > .env << EOL
# Database
DATABASE_URL=${DATABASE_URL}
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=${POSTGRES_DB}

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# OAuth
GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email
RESEND_API_KEY=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOL

# Copy .env to .env.local
cp .env .env.local

echo "Environment files created successfully!" 