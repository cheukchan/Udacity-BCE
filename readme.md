
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
   `http://localhost:000/blockheights/`
   If this is the first time you running this project, the response return should be
   `"blockHeight": 0`
   This stated that you have never created a block yet.

## API Endpoint
###  Get current block height-
- Get http://localhost:8000/blockheights/
  `This endpoint takes no parameter and it will return the current block height`
 ### Get data for specific blockheight-
- GET http://localhost:8000/block/BLOCK_HEIGHT
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
- POST http://localhost:8000/block/
 This endpoint will create a block with the payload "address" and "star" if the address provided has successfuly validated. It will register the star from the payload and add it those information to the block and add it to the blockchain
 #### Example request body: 
      {
      "address": "mmiE4p3kvdz3mW9YdCjdo5KKerKQ9ggv5x",
      "star": {
            "dec": "-26° 29 ",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/"
            }
      }
#### Example response body with 201 response code
      {
      "hash": "c1be04684910b06a103e6716d629f8d312ac4c1a07f19b69425e25b6a68ece6f",
      "height": 4,
      "body": {
            "address": "mmiE4p3kvdz3mW9YdCjdo5KKerKQ9ggv5x",
            "star": {
                  "dec": "-26° 29 ",
                  "ra": "16h 29m 1.0s",
                  "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f203232323232"
            }
      },
      "time": "1538009862",
      "previousBlockHash": "a94e0af35f17eacf87221aae38cb40ffc9ab60f82b6b1e7d773f4162e46e4a89"
      }
 - Return 201 if the block is created and added to the blockchain successfully 
 - Return 400 if the block is not created or not added to the blockchain
 - Return 412 if the request body is empty
 - Return 500 if the request body key is incorrect

  ### Create new block to the chain with the body data
- POST http://localhost:8000/requestValidation
 This endpoint allows the user to submit their request using their wallet address. It will return the address user submitted, the timestamp that the request was submitted, message for user to sign with their bitcoin-core cli or client and the time limit for user to validate
 #### Example request body: 
	{
      "address": "mmiE4p3kvdz3mW9YdCjdo5KKerKQ9ggv5x"
	}
#### Example response body with 201 response code
      {
      "address": "mmiE4p3kvdz3mW9YdCjdo5KKerKQ9ggv5x",
      "requestTimestamp": "1538005223",
      "validationWindow": 300,
      "message": "mmiE4p3kvdz3mW9YdCjdo5KKerKQ9ggv5x:1538005223:starRegistry"
      }
 - Return 201 if the block is created and added to the blockchain successfully 
 - Return 400 if the block is not created or not added to the blockchain
 - Return 412 if the request body is empty
 - Return 500 if the request body key is incorrect

 - POST http://localhost:8000/message-signature/validate
 This endpoint requires the user to submit back the signature generated by the bitcoin-core cli or bitcoin-core client. This endpoint will return success with user info if the user is able to sign the message with the message returned from /requestValidation endpoint. 
 #### Example request body: 
      {
	"address": "mmiE4p3kvdz3mW9YdCjdo5KKerKQ9ggv5x",
	"signature": "IILsYkJVheC4l/CdnpAAGrx7ObyWPjCXgSQavP5RF5zzXI3tGSKrBOtqXfL2L6yNs78blRK9ZMGWv7a4rcN5hEk="
      }
#### Example response body with 201 response code
      {
      "registerStar": true,
      "status": {
            "address": "mmiE4p3kvdz3mW9YdCjdo5KKerKQ9ggv5x",
            "requestTimestamp": "1538005223",
            "message": "mmiE4p3kvdz3mW9YdCjdo5KKerKQ9ggv5x:1538005223:starRegistry",
            "validationWindow": 12,
            "messageSignature": "valid"
            }
      }     
 - Return 201 if the block is created and added to the blockchain successfully 
 - Return 400 if the block is not created or not added to the blockchain
 - Return 412 if the request body is empty
 - Return 500 if the request body key is incorrect

  - GET http://localhost:8000/address:{address}
 This endpoint will return all the stars registered under the address provide in the params in an array format. Each object in the array returns as information regarding the block information, such as block height, created timestamp and address which associated with who signed the message.    
#### Example response body with 201 response code
      [
      {
            "hash": "a2ca24dde810b1d9fd7f75fdb18b8d3718edc4af5ba234ff01beb22dab07db0e",
            "height": 1,
            "body": {
                  "address": "msK5TkH3qg6PFt4vCpdchZCRehzsChjFNH",
                  "star": {
                  "dec": "-26° 29 ",
                  "ra": "16h 29m 1.0s",
                  "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
                  }
            },
            "time": "1538004334",
            "previousBlockHash": "7aa8d8f073dd6a55ab17eb2f220ca3f6e7deac7e269cb9f737bf826817cc32c9"
      },
      {
            "hash": "9a1308b64b5191419993ad2a755850a580408f22d2cecbf0483e18f149c289ee",
            "height": 2,
            "body": {
                  "address": "msK5TkH3qg6PFt4vCpdchZCRehzsChjFNH",
                  "star": {
                  "dec": "-26° 29 ",
                  "ra": "16h 29m 1.0s",
                  "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f203232323232"
                  }
            },
            "time": "1538004659",
            "previousBlockHash": "a2ca24dde810b1d9fd7f75fdb18b8d3718edc4af5ba234ff01beb22dab07db0e"
      }
      ]
 - Return 200 if the block is created and added to the blockchain successfully 
 - Return 400 if the block is not created or not added to the blockchain
 - Return 412 if the request body is empty
 - Return 500 if the request body key is incorrect

   - GET http://localhost:8000/hash:{hash}
 This endpoint will return hash the assoicated with the hash in the params. It is same the object as the GET /address:{address}. 
#### Example response body with 201 response code
      {
            "hash": "9a1308b64b5191419993ad2a755850a580408f22d2cecbf0483e18f149c289ee",
            "height": 2,
            "body": {
                  "address": "msK5TkH3qg6PFt4vCpdchZCRehzsChjFNH",
                  "star": {
                  "dec": "-26° 29 ",
                  "ra": "16h 29m 1.0s",
                  "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f203232323232"
                  }
            },
            "time": "1538004659",
            "previousBlockHash": "a2ca24dde810b1d9fd7f75fdb18b8d3718edc4af5ba234ff01beb22dab07db0e"
      }

 - Return 200 if the block is created and added to the blockchain successfully 
 - Return 400 if the block is not created or not added to the blockchain
 - Return 412 if the request body is empty
 - Return 500 if the request body key is incorrect