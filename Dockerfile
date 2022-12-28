FROM node:14-alpine as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . ./
RUN npm install --silent
RUN npm run build:docker
CMD ["node", "/app/dist/server.js"]
