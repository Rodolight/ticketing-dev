FROM  node:16-alpine3.12

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
RUN npm i dotenv

COPY . .
CMD ["npm", "start"]