FROM node:21-alpine3.18
WORKDIR /ecommerce/frontend
COPY package*.json ./
# RUN npm install
COPY . .
CMD ["node", "index.js"]