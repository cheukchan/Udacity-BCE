const Boom = require("boom");

const { Blockchain } = require("../blockchain");
const { Block } = require("../block")
const { MessageChain } = require("../messageBlock");

const blockchain = new Blockchain();
const messageChain = new MessageChain();

exports.plugin = {
    name: 'block',
    version: '1.0.0',
      register: async (server, options) => {
        server.route({
            method: "POST",
            path: "/block",
            handler: async (request, h) => {
                if(!request.payload.address || !request.payload.star){
                  	return Boom.preconditionFailed("Request body cannot be empty!");
                }
                const requestPayload = {
                  	address: request.payload.address,
                  	star: request.payload.star
				}
				
				const messageData = await messageChain.findMessageData(requestPayload.address)
				
				if(!messageData) return Boom.notFound('This address does not exist in our records!')
				if(!messageData.registerStar) return Boom.unauthorized('Your address has not authorized yet!')
	
				
                const { story } = requestPayload.star
                const storyLength = story.trim().split(' ').length
                const storyBuf = Buffer.from(story).length
            
                if(storyLength > 250 || storyBuf > 500){
                  	return Boom.preconditionFailed("The story of the star cannot be more 250 words or 500 bytes")
				}
            
                try {
                  const body = {
					address: requestPayload.address,
                    star: requestPayload.star,
                  }
					body.star.story = new Buffer(story).toString('hex')
					const newBlock = new Block(body);
					let blockData = await blockchain.addBlock(newBlock);
					return h.response(blockData).created();
                } catch (err) {
					return Boom.badRequest(err);
                }
            }
        });
    }
}