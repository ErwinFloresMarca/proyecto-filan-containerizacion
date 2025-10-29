FROM node:20-alpine as builder

WORKDIR /app

RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# -----------------------------
# ETAPA 2: Ejecución (runtime)
# -----------------------------
FROM node:20-alpine as runtime
WORKDIR /app

RUN apk add --no-cache openssl

# Copiar solo los archivos necesarios desde el builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json
# Copiar el script de entrada
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENV NODE_ENV=production
# Expose port
EXPOSE 3001

# Start the application
ENTRYPOINT ["/app/entrypoint.sh"]
