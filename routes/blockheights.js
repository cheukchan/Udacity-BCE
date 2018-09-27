
const {
    Blockchain,
    readStream,
    getBlockHeight,
    getLevelDBData
  } = require("../blockchain");
  
const blockchain = new Blockchain();

exports.plugin = {
    name: 'blockheights',
    version: '1.0.0',
    register: async (server, options) => {
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
    }
}
