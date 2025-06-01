FROM node:23-alpine

WORKDIR /usr/src/app

ENV PORT=8080

COPY ./app .

RUN npm install && npm install -g tsx ts-node typescript

EXPOSE ${PORT}

CMD ["tsx", "index.ts"]
