FROM node:alpine
ADD package.json package-lock.json /prime/
WORKDIR /prime
RUN apk add --no-cache make gcc g++ python && \
  npm install --production --silent && \
  apk del make gcc g++ python

EXPOSE 3000
ADD . /prime
CMD node keystone.js
