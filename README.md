# prime by The Daily Bruin

The official website for prime, the Daily Bruin’s quarterly arts, culture and lifestyle magazine.

## How To Run

1.  Install mongod and make sure it is running using `mongod`.
2.  Install npm.
3.  Run `npm install`.
4.  Run `node keystone.js`. Note - by default, keystone runs on port 3000. To run on a custom port instead, run `echo "PORT={PORTNO}" >> .env`.
5.  The website should now be available at localhost:3000. (or whatever port you specified).
6.  To access th2e Keystone CMS, navigate to localhost:3000/keystone.
7.  _Important_: To update the frontend on prod, run `npm run build-frontend`.
