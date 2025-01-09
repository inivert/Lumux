#!/bin/bash

# Create production environment file
cat << EOF > .env.docker
# Database
POSTGRES_USER=user
POSTGRES_PASSWORD=$(openssl rand -base64 32)
POSTGRES_DB=lumux
DATABASE_URL=postgresql://user:\${POSTGRES_PASSWORD}@db:5432/lumux?schema=public

# Node
NODE_ENV=production
PORT=3000

# Next Auth
# Generate a new secret: openssl rand -base64 32
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# Copy your existing secrets here
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
# STRIPE_PRICE_ID=
EOF

# Set proper permissions
chmod 600 .env.docker

echo "Environment file created at .env.docker"
echo "Please review and fill in any missing values before running docker-compose" 