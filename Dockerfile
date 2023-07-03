FROM node:20-alpine

WORKDIR /home/app

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

# TERRIBLE CHANGES HAVE BEEN MADE AGAIN