const Boom = require("boom");
const bitcoin = require("bitcoinjs-lib")
const bitcoinMessage = require('bitcoinjs-message')

const { Blockchain } = require("../blockchain");
const { MessageChain } = require("../messageBlock");
const { Block } = require("../block")

const blockchain = new Blockchain();
const messageChain = new MessageChain();

exports.plugin = {
    name: 'validateMessage',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: "POST",
            path: "/message-signature/validate",
            handler: async (request, h) => {
                const messageSignature = {
                    address: request.payload.address,
                    signature: request.payload.signature
                }
                const messageData = await messageChain.findMessageData(messageSignature.address)
                console.log(messageData, "!@#@!#@!#")

                if(messageData.hasOwnProperty('registerStar')){
                    return Boom.boomify(new Error ('The address you entered has already verified'), { statusCode: 409 })
                }

                if(!messageData){
                    return Boom.notFound('Unable to find this message')
                }
                //console.log("111" + bitcoinMessage.verify(messageData.message, messageData.address, messageSignature.signature))
                const currentTimestamp = new Date().getTime().toString().slice(0, -3)

                if(parseInt(messageData.requestTimestamp) + 300 < currentTimestamp){ 
                    return Boom.preconditionFailed('Expired')
                }
                                
                const data = JSON.stringify(messageData)
                    
                let newValidatedObj = {};

                // if(!bitcoinMessage.verify(messageData.message, messageData.address, messageSignature.signature)){
                //     return Boom.unauthorized('You message or your address is illegal')
                // }

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

                return h.response(newValidatedObj).created()
            }
        })
    }
}