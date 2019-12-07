FROM node:11.6.0-alpine AS builder
COPY . ./angular-map
WORKDIR /workspace
RUN npm i
RUN $(npm bin)/ng build

FROM nginx:1.15.8-alpine
COPY --from=builder /angular-map/dist  /usr/share/nginx/html