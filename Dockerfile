# ---------- build ----------
FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# A build-time placeholder only; the real secret comes from .env at runtime.
RUN SESSION_SECRET=build-time-placeholder-not-used-at-runtime-000000 DATA_DIR=/tmp/build-data npm run build

# ---------- runtime ----------
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 DATA_DIR=/app/data
RUN groupadd -r -g 1001 app && useradd -r -u 1001 -g app -d /app app && mkdir -p /app/data && chown app:app /app/data
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/scripts ./scripts
COPY --from=build --chown=app:app /app/node_modules/bcryptjs ./node_modules/bcryptjs
USER app
VOLUME ["/app/data"]
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD node -e "fetch('http://127.0.0.1:3000/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
