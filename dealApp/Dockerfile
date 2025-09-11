# syntax=docker.io/docker/dockerfile:1

# --- Build stage (on amd64 for Jenkins/demo) ---
FROM node:20.8.0-bookworm AS build-stage
WORKDIR /opt/cartesi/dapp
COPY . .
RUN yarn install && yarn build

# --- Runtime stage ---
FROM node:20.8.0-bookworm-slim

LABEL io.cartesi.rollups.sdk_version=0.9.0
LABEL io.cartesi.rollups.ram_size=128Mi

# Install minimal tools + create app user
RUN apt-get update \
 && apt-get install -y --no-install-recommends busybox-static \
 && rm -rf /var/lib/apt/lists/* /var/log/* /var/cache/* \
 && useradd --create-home --user-group dapp

# Set working directory
WORKDIR /opt/cartesi/dapp

# Copy only the built app
COPY --from=build-stage /opt/cartesi/dapp/dist ./dist

# Expose port
EXPOSE 5004

# Run the bundled file
CMD ["node", "dist/index.js"]
