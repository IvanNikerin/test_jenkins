FROM node:0.10.38

RUN mkdir /app
WORKDIR /app
ADD package.json /app/
RUN npm install
ADD . /app/