FROM node:20-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY tsconfig*.json package*.json .

RUN npm install

USER node

COPY --chown=node:node . .

EXPOSE 8443

CMD [ "npm", "run", "start:dev" ]