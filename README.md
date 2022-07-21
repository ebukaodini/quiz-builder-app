# QUIZ BUILDER APP
A simple quiz builder

## Server

#### Setup
To setup the server, enter the client directory.
```bash
$ cd server
```
Create a `.env` file and copy the code below into the file.

```.env
PORT=5000
TOKEN_SECRET=<generated-token-secret>

MONGODB_CONNECTION_URL=<mongodb-connection-url>
MONGODB_CONNECTION_URL_TEST=<mongodb-connection-test-url>
```
Create a MongoDB Cluster and add replace `<mongodb-connection-url>` & `<mongodb-connection-test-url>` with the actual connection url. Make sure the database name is included in the url.

To generate the TOKEN_SECRET, run the following commands below
```bash
$ node -i
```
then
```bash
> require('crypto').randomBytes(32).toString('hex')
```

Replace <generated-token-secret> with the hexa-decimal output from the command above.


#### Test
```bash
$ npm test
$ npm run test:file <path-to-test-file>
```


#### Run
```bash
$ npm start
$ npm run start:dev
```


#### API Documentation
[https://documenter.getpostman.com/view/6884204/UzR1LNRU](https://documenter.getpostman.com/view/6884204/UzR1LNRU)



## Client

### Setup
To setup the client, enter the client directory.
```bash
$ cd client
```

Create a `.env` file and copy the code below into the file.
```.env
REACT_APP_APPID=<generated-token-secret>
REACT_APP_DOMAIN=http://localhost:3000
REACT_APP_API_DOMAIN=http://localhost:5000
```

To generate the REACT_APP_APPID, run the following commands below
```bash
$ node -i
```
then
```bash
> require('crypto').randomBytes(32).toString('hex')
```


### Test
```bash
$ npm test
```


### Run
```bash
$ npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build
```bash
npm run build
```