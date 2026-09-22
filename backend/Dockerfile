# Build context is the repo root (see docker-compose.yml: `context: .`)
# so this image can also bundle exercises.json for the seed script.
FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY backend/package.json backend/package-lock.json* ./
RUN npm install

# Development target: source is bind-mounted in docker-compose.yml and
# tsx watches it for changes, so this stage never needs a rebuild step.
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY backend/ .
COPY exercises.json /exercises.json
EXPOSE 4000
CMD ["npm", "run", "dev"]

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY backend/ .
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY backend/package.json ./
COPY exercises.json ./data/exercises.json
EXPOSE 4000
CMD ["node", "dist/index.js"]
