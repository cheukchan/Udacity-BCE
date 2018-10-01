const Boom = require("boom");

const { Blockchain } = require("../blockchain");
const { Block } = require("../block")

const blockchain = new Blockchain();

exports.plugin = {
    name: 'getStar',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: "GET",
            path: "/stars/hash:{hash}",
            handler: async (request, h) => {
                if(!request.params){
                    return Boom.badRequest('Please check if you have entered with the correct hash!')
                }
                const { hash } = request.params
          
                let result = await blockchain.findBlocksByHash(hash).then(data => data)
              
                if(!result){
                    return Boom.notFound(`Sorry, unable to find the hash or its data with this hash ${hash}`)
                }
                
                return h.response( result )
            }
        })
    }
}