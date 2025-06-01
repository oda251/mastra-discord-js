FROM node:lts-alpine3.22-slim

RUN npm install -g npm@latest

WORKDIR /app

COPY . .

RUN npm install --omit=dev

CMD ["npm", "start"]