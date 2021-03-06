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
                if(!request.payload.address || 
                    !request.payload.star || 
                    !request.payload.star.dec || 
                    !request.payload.star.ra) {
                  	return Boom.preconditionFailed("Request body cannot be empty!");
                }
                const body = {};
                const { address, star } = request.payload;
               
				const messageData = await messageChain.findMessageData(address)
				
				if(!messageData) return Boom.notFound('This address does not exist in our records!')
				if(!messageData.registerStar) return Boom.unauthorized('Your address has not authorized yet!')
                console.log(star.story)
                body.address = address;
                body.star = star;

				if(star.story){
                    const { story } = star
                    const storyBuf = Buffer.from(story).length
                
                    if(storyBuf > 500){
                        return Boom.preconditionFailed("The story of the star cannot be more 250 words or 500 bytes")
                    }

                    body.star.story = new Buffer(story).toString('hex')
                }
            
                try {
                    let blockData = await blockchain.addBlock(new Block(body));
                    messageChain.findAndDeleteMessage(address)
					return h.response(blockData).created();
                } catch (err) {
					return Boom.badRequest(err);
                }
            }
        });
    }
}