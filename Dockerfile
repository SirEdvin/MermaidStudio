# syntax=docker/dockerfile:1
FROM node:24-alpine AS build
ENV HUSKY=0
WORKDIR /app
RUN npm install -g pnpm@10
COPY package.json pnpm-lock.yaml ./
COPY vendor/ ./vendor/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run lint && pnpm exec vitest run && pnpm run build && pnpm run check:elk && pnpm run check:ai-lazy

FROM nginxinc/nginx-unprivileged:1.29-alpine
ENV PORT=8080
USER root
RUN mkdir -p /etc/nginx/templates && chmod 755 /etc/nginx/templates
COPY --chmod=0644 docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/ /usr/share/nginx/html/
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider "http://127.0.0.1:${PORT}/index.html" || exit 1
