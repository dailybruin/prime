FROM node:alpine
WORKDIR /prime

RUN apk add --no-cache make gcc g++ python
  
ADD package.json package-lock.json /prime/

RUN npm install --production --silent && \
	apk del make gcc g++ python

EXPOSE 3000
ADD . /prime
CMD node server.js
