FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# -----------------------------
# ETAPA 2: Ejecución (runtime)
# -----------------------------
FROM node:18-alpine as runtime
WORKDIR /app

# Copiar solo los archivos necesarios desde el builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./tsconfig.json
ENV NODE_ENV=production
# Expose port
EXPOSE 3002

# Start the application
CMD ["npm", "run", "start:prod"]
