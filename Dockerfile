FROM nginx:latest

COPY ./dist/akn-ui /usr/share/nginx/html

EXPOSE 80