"use strict";
const Hapi = require("hapi");
const Boom = require("boom");
const Joi = require("Joi")

const { Blockchain, readStream, getBlockHeight, getLevelDBData } = require("./blockchain");
const { MessageChain } = require("./messageBlock");
const { Block } = require("./block");

const BlockHeights = require('./routes/blockheights')
const CreateBlock = require('./routes/block')
const GetBlock = require('./routes/getBlock')
const GetValidation = require('./routes/getValidation')
const GetStar = require('./routes/getStar')
const GetAddress = require('./routes/getAddress')
const ValidateMessage = require('./routes/validateMessage')

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
      },
      {
        plugin: CreateBlock
      },
      {
        plugin: GetBlock
      },      
      {
        plugin: GetValidation
      },
      {
        plugin: GetStar
      },
      {
        plugin: GetAddress
      },
      {
        plugin: ValidateMessage
      },
    ];
    
    const server = new Hapi.Server({
      port: 8000,
      host: "localhost",
      router: {
        stripTrailingSlash: true
      }
    });
    
    await server.register(plugins, { once: true });
    
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