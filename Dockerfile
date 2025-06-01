FROM node:23-alpine

WORKDIR /usr/src/app

COPY ./app .

RUN npm install && npm install -g tsx ts-node typescript


EXPOSE 8080

CMD ["tsx", "index.ts"]
