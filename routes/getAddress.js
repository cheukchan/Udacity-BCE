const Boom = require("boom");

const { Blockchain } = require("../blockchain");
const { Block } = require("../block")

const blockchain = new Blockchain();

exports.plugin = {
    name: 'getAddress',
    version: '1.0.0',
    register: async (server, options) => {
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
            }
          })
    }
}