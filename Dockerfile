FROM node:0.12
MAINTAINER mulab.thu@gmail.com

RUN add-apt-repository -y ppa:nginx/stable
RUN apt-get update
RUN apt-get install -y nginx
RUN rm -rf /var/lib/apt/lists/*
RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf
RUN chown -R www-data:www-data /var/lib/nginx
COPY nginx-default /etc/nginx/sites-enabled/default

RUN npm install -g bower gulp
COPY . /website
WORKDIR /website
RUN bower install
RUN gulp build

WORKDIR /etc/nginx
CMD ["nginx"]

EXPOSE 80
EXPOSE 442
