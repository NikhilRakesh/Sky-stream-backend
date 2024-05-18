FROM node:18-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER root

RUN apk update
RUN apk add ffmpeg

USER node

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000
EXPOSE 1935

CMD [ "npm", "start" ]