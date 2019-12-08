FROM node:11.6.0-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run-script build

FROM nginx:1.15.8-alpine
COPY --from=builder /usr/src/app  /usr/share/nginx/html

EXPOSE 90

CMD [“nginx”, “-g”, “daemon off;”]
