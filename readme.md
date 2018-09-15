
# Blockchain project

This is the blockchain project by Cheuk Chan for Udacity nanodegree on Blockchain Engineer. This project is built with HapiJS@17.5.4 and levelDB@4.0.0. 

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

## API Endpoint
###  Get current block height-
- Get http://localhost:3000/blockheights/
  `This endpoint takes no parameter and it will return the current block height`
 ### Get data for specific blockheight-
- GET http://localhost:3000/block/BLOCK_HEIGHT
 This endpoint take the resource as the block height. And it will return the information about the blockheight associated with it.
 #### Example payload:
	{
	  "hash": "19ada73c57d379fa034be5af10ca2330238a87647d6daf6a5f08f901edd226c2",
	  "height": 2,
	  "body": "Testing block with test string data",
	  "time": "1536987082",
	  "previousBlockHash": "6a17168a34cd2e7528c35d3536c5b16dd750f9740f409abbbc60789bf6dd61eb"
    }
 - Return 200 when metadata of the blockheight return from levelDB
 - Return 404 if there is no related data return from the inputted blockheight

 ### Create new block to the chain with the body data
- POST http://localhost:3000/block/
 This endpoint will create a block with the payload "body". It takes json object in the request body.
 #### Example request body: 
	{
      "body": "This is the example body of the POST request"
	}
#### Example response body with 201 response code
	{
	  "hash": "ffb40e38f73a87613d6c3a7f54dc82cec99e19c40a07ca96bd930c0dc12f3856",
      "height": 1,
      "body": "This is an example of the added block",
      "time": "1536989542",
      "previousBlockHash": "296e04eff045d72be192a26a6f47ff067024438ec59d7586e4c535dd2df550a5"
      }
 - Return 201 if the block is created and added to the blockchain successfully 
 - Return 400 if the block is not created or not added to the blockchain
 - Return 412 if the request body is empty
 - Return 500 if the request body key is incorrect
