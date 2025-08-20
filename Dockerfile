FROM oven/bun:1 as builder
ENV TURBO_CI=true

ARG VITE_SERVER_URL
ARG VITE_WEB_URL

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_WEB_URL=$VITE_WEB_URL

WORKDIR /app

COPY bun.lock ./
COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/

RUN bun install --frozen-lockfile

COPY . .

RUN echo "VITE_SERVER_URL=${VITE_SERVER_URL}" > apps/web/.env
RUN echo "VITE_WEB_URL=${VITE_WEB_URL}" >> apps/web/.env

RUN bun run build

FROM oven/bun:1-slim as production
WORKDIR /app

COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/server/package.json ./apps/server/

RUN bun install --production --frozen-lockfile --ignore-scripts

COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/apps/server/dist ./apps/server/dist

EXPOSE 3000

CMD ["bun", "run", "apps/server/dist/index.js"]