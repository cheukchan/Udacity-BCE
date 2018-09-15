"use strict";

const Hapi = require("hapi");
const Boom = require("boom");

const {
  Blockchain,
  readStream,
  getBlockHeight,
  getLevelDBData
} = require("./blockchain");
const { Block } = require("./block");

const blockchain = new Blockchain();

const server = Hapi.server({
  port: 8000,
  host: "localhost",
  router: {
    stripTrailingSlash: true
  }
});

server.route({
  method: "GET",
  path: "/blockheights",
  handler: async (request, h) => {
    let currentHeight = await blockchain.getBlockHeight().then(data => data);
    let data = await blockchain.getBlock(currentHeight);

    if (data) {
      return h
        .response({ blockHeight: data.height })
        .type("json")
        .code(200);
    } else {
      return Boom.notFound("Fail to list all blocks");
    }
  }
});

server.route({
  method: "GET",
  path: "/block/{BLOCK_HEIGHT}",
  handler: async (request, h) => {
    if (typeof request.params.BLOCK_HEIGHT !== 'number') {
      return Boom.badRequest();
    }

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
    let body = request.payload.body

    if(!body.length){
      return Boom.preconditionFailed("Request body cannot be empty!");
    }
    
    try {
      let newBlock = new Block(body);
      let blockData = await blockchain.addBlock(newBlock);
      return h.response({ blockData }).created();
    } catch (err) {
      return Boom.badRequest(err);
    }
  }
});

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
