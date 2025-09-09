# syntax=docker.io/docker/dockerfile:1

# Build stage on riscv64 to ensure native binaries match
FROM --platform=linux/riscv64 cartesi/node:20.8.0-jammy AS build-stage
WORKDIR /opt/cartesi/dapp
COPY . .
RUN yarn install && yarn build

# Runtime stage
FROM --platform=linux/riscv64 cartesi/node:20.8.0-jammy-slim

ARG MACHINE_EMULATOR_TOOLS_VERSION=0.14.1
RUN apt-get update --allow-insecure-repositories \
 && apt-get install -y --no-install-recommends --allow-unauthenticated wget \
 && wget https://github.com/cartesi/machine-emulator-tools/releases/download/v${MACHINE_EMULATOR_TOOLS_VERSION}/machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb \
 && dpkg -i machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb \
 || apt-get -f install -y \
 && rm machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb

LABEL io.cartesi.rollups.sdk_version=0.9.0
LABEL io.cartesi.rollups.ram_size=128Mi

RUN apt-get update --allow-insecure-repositories \
 && apt-get install -y --no-install-recommends --allow-unauthenticated busybox-static \
 && rm -rf /var/lib/apt/lists/* /var/log/* /var/cache/* \
 && useradd --create-home --user-group dapp

ENV PATH="/opt/cartesi/bin:${PATH}"
WORKDIR /opt/cartesi/dapp
COPY --from=build-stage /opt/cartesi/dapp/dist .

ENV ROLLUP_HTTP_SERVER_URL="http://0.0.0.0:5005"
EXPOSE 5005

ENTRYPOINT ["rollup-init"]
CMD ["node", "index.js"]
