FROM node:20-alpine

WORKDIR /home/node/app

COPY --chown=node:node tsconfig*.json package*.json .

RUN npm ci

USER node

COPY --chown=node:node . .

USER node

EXPOSE 8443

CMD [ "npm", "run", "start:dev" ]