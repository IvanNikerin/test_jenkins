FROM node:5.4.1
RUN mkdir /app
WORKDIR /app
ADD package.json /app/
RUN npm install
ADD . /app/