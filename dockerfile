FROM node:11.6.0-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
RUN sudo npm run-script build

FROM nginx:1.15.8-alpine
COPY --from=builder /workspace/dist  /usr/share/nginx/html
