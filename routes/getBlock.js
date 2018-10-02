const Boom = require("boom");

const { Blockchain } = require("../blockchain");
const { hexToString } = require("../helpers/hexToString")

const blockchain = new Blockchain();

exports.plugin = {
    name: 'getBlock',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: "GET",
            path: "/block/{BLOCK_HEIGHT}",
            handler: async (request, h) => {
                const { BLOCK_HEIGHT } = request.params
                console.log("bbbb" + BLOCK_HEIGHT)
                
                let result = await blockchain.findBlocksByBlockheight(BLOCK_HEIGHT);
                result.body.star["storyDecoded"] = hexToString(result.body.star.story);
                console.log(result)
                if (!result) {
                    return Boom.notFound("Unable to find blockheight");
                }  

                return h.response( result );
            }
        }) 
    }
}
    