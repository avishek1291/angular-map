FROM node:11.6.0-alpine AS builder
COPY package.json /workspace
RUN npm i
RUN npm run build

FROM nginx:1.15.8-alpine
COPY --from=builder /workspace/dist  /usr/share/nginx/html