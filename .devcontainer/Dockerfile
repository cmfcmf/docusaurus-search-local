FROM node:16.16.0-alpine3.15

RUN touch /yarn-error.log && chown -R node:node yarn-error.log

RUN apk add git
RUN yarn install
