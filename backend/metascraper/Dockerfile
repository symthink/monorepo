# docker build . -t meta-scraper
# docker tag meta-scraper us-central1-docker.pkg.dev/symthink-io/gcf-artifacts/meta-scraper:1.0
# docker push us-central1-docker.pkg.dev/symthink-io/gcf-artifacts/meta-scraper

#    Value    Normalized
#    aarch64  arm64      # the latest v8 arm architecture. Used on Apple M1, AWS Graviton, and Raspberry Pi 3's and 4's
#    armhf    arm        # 32-bit v7 architecture. Used in Raspberry Pi 3 and  Pi 4 when 32bit Raspbian Linux is used
#    armel    arm/v6     # 32-bit v6 architecture. Used in Raspberry Pi 1, 2, and Zero
#    i386     386        # older Intel 32-Bit architecture, originally used in the 386 processor
#    x86_64   amd64      # all modern Intel-compatible x84 64-Bit architectures
#    x86-64   amd64      # same
FROM --platform=${TARGETPLATFORM:-linux/amd64} ghcr.io/openfaas/of-watchdog:0.9.13 as watchdog
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:21 as ship

ARG TARGETPLATFORM
ARG BUILDPLATFORM

COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

RUN apt-get update \
    && apt-get install -y curl ca-certificates \
    libnss3 libx11-xcb1 libxcomposite1 libxcursor1 \
    libxdamage1 libxfixes3 libxi6 libxrandr2 libxss1 \
    libxtst6 libgbm1 libasound2 libatk1.0-0 libatk-bridge2.0-0 \
    libxkbcommon0 libgtk-3-0 libgdk-pixbuf2.0-0 libfontconfig1 \
    libfreetype6 libcups2 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/app/function \
    && groupadd -r app && useradd -r -g app app \
    && chmod 777 /tmp \
    && chown -R app:app /home/app

USER app

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

# Entrypoint
WORKDIR /home/app
COPY --chown=app:app package.json ./

# This ordering means the npm installation is cached for the outer function handler.
RUN npm i

# Copy outer function handler
COPY --chown=app:app index.js ./

# COPY function node packages and install, adding this as a separate
# entry allows caching of npm install

WORKDIR /home/app/function
COPY --chown=app:app function/*.json ./

RUN --mount=type=cache,target=/tmp/.npm npm ci

# COPY function files and folders
COPY --chown=app:app function/ ./

# Run any tests that may be available
RUN npm test

# Set correct permissions to use non root user
WORKDIR /home/app/

ENV cgi_headers="true"
ENV fprocess="node index.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"

ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"

ENV prefix_logs="false"

EXPOSE 3000

HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]