"use strict";

const bitcoin = require("bitcoinjs-lib")
const bitcoinMessage = require('bitcoinjs-message')
const Hapi = require("hapi");
const Boom = require("boom");
const Joi = require("Joi")

const {
  Blockchain,
  readStream,
  getBlockHeight,
  getLevelDBData
} = require("./blockchain");
const {
  MessageChain
} = require("./messageBlock");

const BlockHeights = require('./routes/blockheights')
const { Block } = require("./block");

const internals = {};

// const server = Hapi.server({
//   port: 8000,
//   host: "localhost",
//   router: {
//     stripTrailingSlash: true
//   }
// });
internals.init = async () => {

const plugins = [
  {
    plugin: BlockHeights
  }
];

const server = new Hapi.Server({
  port: 8000,
  host: "localhost",
  router: {
    stripTrailingSlash: true
  }
});
const blockchain = new Blockchain();
const messageChain = new MessageChain();

await server.register(plugins, { once: true });

server.route({
  method: "GET",
  path: "/block/{BLOCK_HEIGHT}",
  handler: async (request, h) => {
    let blockInfo = await blockchain.getBlock(request.params.BLOCK_HEIGHT);

    if (blockInfo) {
      return h.response( blockInfo );
    } else {
      return Boom.notFound("Unable to find blockheight");
    }
  }
});

server.route({
  method: "POST",
  path: "/block",
  handler: async (request, h) => {
    if(!request.payload.address || !request.payload.star){
      return Boom.preconditionFailed("Request body cannot be empty!");
    }

    const requestPayload = {
      address: request.payload.address,
      star: request.payload.star
    }

    const { story } = requestPayload.star
    const storyLength = story.trim().split(' ').length
    const storyBuf = Buffer.from(story).length

    if(storyLength > 250 || storyBuf > 500){
      return Boom.preconditionFailed("The story of the star cannot be more 250 words or 500 bytes")
    }

    try {
      const body = {
        address: requestPayload.address,
        star: requestPayload.star,
      }
      body.star.story = new Buffer(story).toString('hex')
      const newBlock = new Block(body);
      let blockData = await blockchain.addBlock(newBlock);
      return h.response(blockData).created();
    } catch (err) {
      return Boom.badRequest(err);
    }
  }
});

server.route({
  method: "POST",
  path: "/requestValidation",
  handler: async (request, h) => {
    const validationObj = {
      address: request.payload.address,
      requestTimestamp: new Date().getTime().toString().slice(0, -3),
      validationWindow: 300
    }

    validationObj.message = `${validationObj.address}:${validationObj.requestTimestamp}:starRegistry`;
    
    messageChain.addBlock(validationObj.address, validationObj)

    return h.response( validationObj ).created()

  }
})

server.route({
  method: "POST",
  path: "/message-signature/validate",
  handler: async (request, h) => {
    const messageSignature = {
      address: request.payload.address,
      signature: request.payload.signature
    }
      
    const messageData = await messageChain.getBlock(messageSignature.address)
    
    if(messageData.registerStar){
      return Boom.boomify(new Error ('The address you entered has already verified'), { statusCode: 409 })
    }

    const currentTimestamp = new Date().getTime().toString().slice(0, -3)
      
    const data = JSON.stringify(messageData)
      
    let newValidatedObj = {};
      
    if(parseInt(messageData.requestTimestamp) + 300 < currentTimestamp){ 
      return Boom.preconditionFailed('Expired')
    }
    console.log('true? ' + bitcoinMessage.verify(messageData.message, messageData.address, messageSignature.signature))
    if(bitcoinMessage.verify(messageData.message, messageData.address, messageSignature.signature)){
      newValidatedObj = {
        registerStar: true,
        status: {
          address: messageData.address,
          requestTimestamp: messageData.requestTimestamp,
          message: messageData.message,
          validationWindow: parseInt(currentTimestamp) - parseInt(messageData.requestTimestamp),
          "messageSignature": "valid"
        }
      }
      messageChain.addBlock(messageSignature.address, newValidatedObj)
    }
    return h.response(newValidatedObj).created()

  }
})

server.route({
  method: "GET",
  path: "/stars/address:{address}",
  handler: async (request, h) => {
    console.log(request.params)
    if(!request.params){
      return Boom.badRequest('Please check if you have entered with the correct address!')
    }

    const { address } = request.params
    console.log('address ' + address)

    const resultsList = await blockchain.findBlocksByAddress(address).then(data => data)
    console.log('h ' + resultsList.length)
    if(!resultsList.length){
      return Boom.notFound(`Sorry, unable to find the hash or its data with this address ${address}`)
    }
    return h.response( resultsList )
  },
  options: {
    validate: {
      params: {
        address: Joi.string().min(3)
      }
    }
  }
})

server.route({
  method: "GET",
  path: "/stars/hash:{hash}",
  handler: async (request, h) => {
    if(!request.params){
      return Boom.badRequest('Please check if you have entered with the correct hash!')
    }

    const { hash } = request.params
    console.log('hash ' + hash)

    let result = await blockchain.findBlocksByHash(hash).then(data => data)
    console.log()
    if(!result){
      return Boom.notFound(`Sorry, unable to find the hash or its data with this hash ${hash}`)
    }
    return h.response( result )
  }

})

await server.start();
return server;	   
}
// const init = async () => {
//   await server.start();
//   console.log(`Server running at: ${server.info.uri}`);
// };

// process.on("unhandledRejection", err => {
//   console.log(err);
//   process.exit(1);
// });

// init();
internals.init()
  .then((server) => {
    console.log(`Server started at: ${server.info.uri}`);
    console.log(`Server started port: ${server.info.port}`)
  }).
  catch((err) => {
    console.log(`Server start up failed: ${err}`)
  })