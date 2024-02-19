FROM node:21
WORKDIR /app/ecommerce/frontend
RUN apt-get update && apt-get install -y git
RUN git clone https://github.com/denomparkour/ecomm-frontend .
RUN npm install 
RUN npm run build
RUN npm install -g serve
RUN npm run build
EXPOSE 3000
CMD ["serve", "-s", "dist"]

