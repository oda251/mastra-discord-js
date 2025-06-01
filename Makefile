APP=discord-bot

all: ${APP}

${APP}: package.json
	@export $$(cat .env | xargs) && \
	cd app && \
	npm install && \
	npm start

build:
	docker build -t ${APP} .

run: build
	docker run -it --env-file .env discord-bot

.PHONY: all build run