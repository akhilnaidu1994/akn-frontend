FROM nginx:latest

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./dist/akn-ui /usr/share/nginx/html

EXPOSE 80