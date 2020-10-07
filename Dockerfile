FROM node:12

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]