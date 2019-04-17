FROM mhart/alpine-node:10

# create workdir
RUN mkdir -p /app

# set workdir
WORKDIR /app

# cache web and common dir dependencies
COPY yarn.lock package.json ./
RUN yarn install

RUN chmod 777 /app

# Change timezone
RUN apk update
RUN apk upgrade
RUN apk add ca-certificates && update-ca-certificates
RUN apk add --update tzdata
ENV TZ=Europe/Prague
# Clean APK cache
RUN rm -rf /var/cache/apk/*

COPY ./.deploy/harden.sh /usr/local/bin/harden.sh
RUN chmod 777 /usr/local/bin/harden.sh
RUN /usr/local/bin/harden.sh

USER user

# Copy the code
COPY . .

ENTRYPOINT yarn start