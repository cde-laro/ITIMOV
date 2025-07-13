FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm install -g ts-node @types/node

COPY entrypoint.sh ./
ENTRYPOINT ["./entrypoint.sh"]