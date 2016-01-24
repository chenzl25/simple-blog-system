# simple-blog-system
simple-blog-system developed by:
Angular.js, Express, Mongodb, node.js, gulp

##Build

1. Run `npm install` to install the dependencies for the frontend.
2. `cd blog-backend` Go to the directory `express` Run `npm install` again to install the dependencies for the backend.
3. develop mode: `cd ..` come back to the root directory Run `npm start` and visit `http://localhost:8888` (make sure port 8888 and 3000 are not taken, because the nodejs will run in port 3000 and the webpack server will run in port 8888)
4. product mode: `cd ..` come back to the root directory Run `npm run deploy` and then `cd blog-backend` go to the directory `blog-backend` run `npm start` and then visit `http://localhost:3000` (make sure port 3000 is not taken)


##Test
When you finish the deploy, you can run `npm test`(the directory is `blog-backend`) to test the blog-backend.(I use the mocha and chai to test)

Also after you start your production mode server `npm start`(the directory is `blog-backend`),you can do the e2e test `protractor test/protractor-conf.js`(the directory is `/`, the root).
