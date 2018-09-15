# Blockchain project

This is the blockchain project by Cheuk Chan for Udacity nanodegree on Blockchain Engineer

## Getting started

This is kind of the instruction for setting this project and API documentation

### Prerequisites

Software that you need

```
Postman
NPM installed
Node version 8 and up
```

### Installing

1. Clone this repo to your local env folder
2. Start with
   `npm i`
3. After npm install is done
   `node server.js`
   ###OR
   If you have nodemon
   `nodemon server.js`

- [ ] To install nodemon:
      `npm i -g nodemon`

4. To test if the server is running, open up your postman
   `http://localhost:3000/blockheights/`
   If this is the first time you running this project, the response return should be
   `"blockHeight": 0`
   This stated that you have never created a block yet.

### Endpoint

- Get http://localhost:3000/blockheights/
  `This endpoint takes no parameter and it will return the current block height`
- GET http://localhost:3000/blockheights/:height
  `This endpoint take the resource as the block height. And it will return the information about the blockheight assoicated with it`
  This will return 404 is no related data return from the inputted blockheight
- POST http://localhost:3000/blockheights/
  `This endpoint will create a block with the payload *data*`

      		Example:
      		{
      		    "data": "2312321"
      		}
