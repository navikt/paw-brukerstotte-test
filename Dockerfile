FROM denoland/deno:2.7.12 AS builder
WORKDIR /app
# Copy dependency files first
COPY deno.json deno.lock ./
COPY . .

# Cache dependencies with npm token — token mounted in memory, never in image history
RUN --mount=type=secret,id=npm_token \
    NODE_AUTH_TOKEN=$(cat /run/secrets/npm_token) \
    deno cache --frozen src/server.tsx


# Runtime stage — distroless, no shell, no extra OS packages
FROM denoland/deno:distroless-2.7.12
WORKDIR /app

COPY --from=builder /app .
COPY --from=builder /deno-dir /deno-dir


ENV TZ="Europe/Oslo"
EXPOSE 8000
CMD ["task", "start"]
