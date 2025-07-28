FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm cache clean --force && npm install

CMD ["npm", "start"]