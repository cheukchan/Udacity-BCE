const Boom = require("boom");

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
                const requestedAddress = request.payload.address;
                const validationObj = {}
                if(!request.payload.address) {
                    Boom.badRequest("You can't submit a empty address!")
                }

                const messageData = await messageChain.findMessageData(requestedAddress);

                if(messageData) {

                    if(messageData.hasOwnProperty('registerStar')) return Boom.notAcceptable("You already have a validated address!")
                    const currentTimestamp = new Date().getTime().toString().slice(0, -3);
                    const validationObj = messageData;
                    console.log("!@#!@#!@#" + validationObj)
                    if(parseInt(messageData.requestTimestamp) + 300 < currentTimestamp){
                        messageChain.findAndDeleteMessage(requestedAddress);
                        return Boom.preconditionFailed('Expired, please request a message again! The previouse requested message will be deleted!');
                    }

                    validationObj.validationWindow =  300 - (currentTimestamp - messageData.requestTimestamp);
                    messageChain.addBlock(requestedAddress, validationObj)

                    return h.response( validationObj )
                }

                validationObj.address = requestedAddress;
                validationObj.requestTimestamp = new Date().getTime().toString().slice(0, -3);
                validationObj.validationWindow = 300;
          
                validationObj.message = `${validationObj.address}:${validationObj.requestTimestamp}:starRegistry`;
              
                messageChain.addBlock(validationObj.address, validationObj)
          
                return h.response( validationObj ).created()  
            }    
        })
    }
}