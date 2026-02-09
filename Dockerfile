FROM denoland/deno:2.6.8
WORKDIR /app
# Copy dependency files first
COPY deno.json deno.lock* ./
COPY . .

# Cache dependencies with npm token
ARG NPM_AUTH_TOKEN
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_AUTH_TOKEN}" >> ~/.npmrc && \
    deno cache src/server.tsx && \
    rm ~/.npmrc


USER deno
ENV TZ="Europe/Oslo"
EXPOSE 8000
CMD ["deno", "task", "start"]
