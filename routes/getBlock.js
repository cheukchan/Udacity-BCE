const Boom = require("boom");

const { Blockchain } = require("../blockchain");

const blockchain = new Blockchain();

exports.plugin = {
    name: 'getBlock',
    version: '1.0.0',
    register: async (server, options) => {
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
        }) 
    }
}
    