FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
RUN npm i dotenv

COPY . .
CMD ["npm", "start"]