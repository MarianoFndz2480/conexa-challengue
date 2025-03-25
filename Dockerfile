FROM node:22-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy remaining files
COPY . .

EXPOSE 3000

# Script to wait for DB and run migrations before starting
CMD sh -c "npx prisma migrate deploy && npm start" 