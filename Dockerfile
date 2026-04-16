# Dependency stage
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

# RUN npm cicls

RUN npm ci --legacy-peer-deps

# Build stage
FROM node:20-alpine AS builder

ARG SERVICE
ENV SERVICE=${SERVICE}

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build 

# Production stage
FROM node:20-alpine AS runner

ARG SERVICE
ENV SERVICE=${SERVICE}
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["sh", "-c", "node dist/apps/${SERVICE}/main.js"]
