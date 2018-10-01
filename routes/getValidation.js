const { MessageChain } = require("../messageBlock");

const messageChain = new MessageChain();

exports.plugin = {
    name: 'getValidation',
    version: '1.0.0',
    register: async (server, options) => {
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
    }
}