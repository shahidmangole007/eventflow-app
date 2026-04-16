# # Dependency stage
# FROM node:20-alpine AS deps

# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci --legacy-peer-deps

# # Build stage
# FROM node:20-alpine AS builder

# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .


# RUN npm run build

# # Production stage
# FROM node:20-alpine AS runner

# ARG SERVICE
# ENV SERVICE=${SERVICE}
# ENV NODE_ENV=production

# WORKDIR /app

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist


# CMD ["sh", "-c", "node dist/apps/${SERVICE}/main.js"]


# Dependency stage
FROM node:20-alpine AS deps

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Build stage
FROM node:20-alpine as builder

ARG SERVICE
ENV SERVICE=${SERVICE}

RUN npm install -g pnpm

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build ${SERVICE}

# Production stage
FROM node:20-alpine AS runner

ARG SERVICE
ENV SERVICE=${SERVICE}
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "sh", "-c", "node dist/apps/${SERVICE}/main.js" ]