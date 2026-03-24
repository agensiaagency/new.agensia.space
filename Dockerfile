FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
COPY apps/pocketbase/package.json apps/pocketbase/
RUN npm ci

COPY apps/web apps/web
RUN npm run build --prefix apps/web

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app/apps/web/dist /app/public
COPY apps/api apps/api
COPY apps/pocketbase/pocketbase /app/pocketbase/pocketbase
COPY apps/pocketbase/pb_migrations /app/pocketbase/pb_migrations
COPY apps/pocketbase/pb_hooks /app/pocketbase/pb_hooks

RUN cd apps/api && npm ci --omit=dev

RUN chmod +x /app/pocketbase/pocketbase

EXPOSE 3000 8080 8090

COPY <<'EOF' /app/start.sh
#!/bin/sh
/app/pocketbase/pocketbase serve --http=0.0.0.0:8090 --dir=/app/pocketbase/pb_data --migrationsDir=/app/pocketbase/pb_migrations --hooksDir=/app/pocketbase/pb_hooks &
cd /app/apps/api && node src/main.js &
npx serve /app/public -l 3000 -s &
wait
EOF
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
