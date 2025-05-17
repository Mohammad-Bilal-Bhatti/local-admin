FROM node:20-alpine

WORKDIR /home/node/app

RUN chown -R node:node .
COPY --chown=node:node tsconfig*.json package*.json .

RUN npm ci

USER node

COPY --chown=node:node . .

RUN npm run build

USER node

EXPOSE 80

CMD [ "npm", "run", "start:prod" ]