FROM node:21.6.0

RUN npm install -g @nestjs/cli

WORKDIR /app


COPY . .

RUN chmod +x ./entrypoint.sh