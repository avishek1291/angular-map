FROM node:11.6.0-alpine AS builder
COPY package.json /workspace
WORKDIR /container/workspace
RUN npm i
RUN npm run build

FROM nginx:1.15.8-alpine
COPY --from=builder /angular-map/dist  /usr/share/nginx/html
