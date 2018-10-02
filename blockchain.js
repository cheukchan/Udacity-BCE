const level = require("level");
const SHA256 = require("crypto-js/sha256");
var { Block } = require("./block");

const chainDB = "./chaindata";

const db = level(chainDB, { valueEncoding: "json" });

class Blockchain {
  constructor() {
    getBlockHeight().then(height => {
      if (height === 0) {
        this.addBlock(new Block("First block in the chain - Genesis block"));
      }
    });
  }

  // Add new block
  async addBlock(newBlock) {
    newBlock.height = (await this.getBlockHeight()) + 1;
    newBlock.time = new Date()
      .getTime()
      .toString()
      .slice(0, -3);
    if (newBlock.height > 0) {
      newBlock.previousBlockHash = await this.getPreviousBlock();
    }
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    addDataToLevelDB(newBlock);
    return await newBlock;
  }

  getBlockHeight() {
    return new Promise(
      (resolve, err) => {
        let i = 0;
        db.createReadStream()
          .on("data", data => {
            i++;
          })
          .on("error", err => {
            return console.log("Unable to read data stream!", err);
          })
          .on("close", () => {
            //console.log("Block #" + i);
            resolve(i - 1);
          });
      },
      err => {
        reject("Iam the error", err);
      }
    );
  }

  async getBlock(blockHeight) {
    const data = await getLevelDBData(blockHeight);
    return data;
  }

  async getPreviousBlock() {
    const currentHeight = await getBlockHeight();
    const data = await getLevelDBData(currentHeight - 1);
    return data.hash;
  }

  findBlocksByBlockheight(height) {
    return new Promise(
      (resolve, reject) => {
        let i = 0;
        db.createReadStream()
          .on("data", data => {
            console.log(data.key, "=", data.value);
            console.log('hash' + data.value.height)
            console.log(parseInt(height))
            if(data.value.height === parseInt(height)){
              resolve(data.value);
            }
          })
          .on("error", err => {
            return console.log("Unable to read data stream!", err);
          })
          .on("close", () => {
            //console.log("Block #" + i);
            resolve(null);
          });
      },
      err => {
        reject("Iam the error", err);
      }
    );
  }

  findBlocksByAddress(address) {
    return new Promise(
      (resolve, err) => {
        let i = 0;
        let results = []
        db.createReadStream()
          .on("data", data => {
            console.log(data.key, "=", data.value);
            console.log(data.value.body.address)
            console.log(address)
            if(data.value.body.address === address){
              results.push(data.value)
              console.log('hi')
            }
          })
          .on("error", err => {
            return console.log("Unable to read data stream!", err);
          })
          .on("close", () => {
            //console.log("Block #" + i);
            resolve(results);
          });
      },
      err => {
        reject("Iam the error", err);
      }
    );
  }

  findBlocksByHash(hash) {
    return new Promise(
      (resolve, reject) => {
        let i = 0;
        db.createReadStream()
          .on("data", data => {
            console.log(data.key, "=", data.value);
            console.log('hash' + data.value.hash)
            console.log(hash)
            if(data.value.hash === hash){
              resolve(data.value);
            }
          })
          .on("error", err => {
            return console.log("Unable to read data stream!", err);
          })
          .on("close", () => {
            //console.log("Block #" + i);
            resolve(null);
          });
      },
      err => {
        reject("Iam the error", err);
      }
    );
  }


  async validateBlock(blockHeight) {
    // get block object
    let block = await this.getBlock(blockHeight);
    // get block hash
    let blockHash = await block.hash;
    // remove block hash to test block integrity
    block.hash = "";
    // generate block hash
    let validBlockHash = await SHA256(JSON.stringify(block)).toString();
    // Compare
    return new Promise((resolve, reject) => {
      if (blockHash === validBlockHash) {
        resolve(true);
      } else {
        console.log(
          "Block #" +
            blockHeight +
            " invalid hash:\n" +
            blockHash +
            "<>" +
            validBlockHash
        );
        reject(false);
      }
    });
  }

  async validateChain() {
    let errorLog = [];
    let height = await this.getBlockHeight();
    //console.log(height);
    for (var i = 0; i < height; i++) {
      if (!this.validateBlock(i)) errorLog.push(i);
      let blockHash = await this.getBlock(i).then(data => data.hash);
      let previousHash = await this.getBlock(i + 1).then(
        data => data.previousBlockHash
      );
      if (blockHash !== previousHash) {
        errorLog.push(i);
      }
    }

    if (errorLog.length > 0) {
      return "Block errors = " + errorLog.length;
      console.log("Blocks: " + errorLog);
    } else {
      return "No errors detected";
    }
  }
}

///outside of class
function getBlockHeight() {
  return new Promise(
    (resolve, err) => {
      let i = 0;
      db.createReadStream()
        .on("data", data => {
          i++;
        })
        .on("error", err => {
          return console.log("Unable to read data stream!", err);
        })
        .on("close", () => {
          resolve(i);
        });
    },
    err => {
      reject("Iam the error", err);
    }
  );
}

function addLevelDBData(key, value) {
  db.put(key, value, err => {
    if (err) return console.log("Block " + key + " submission failed", err);
    console.log("value =" + value);
  });
}

function getLevelDBData(key) {
  return new Promise((resolve, reject) => {
    db.get(key, (err, value) => {
      if (err) return reject(err);
      resolve(value);
    });
  });
}

function addDataToLevelDB(value) {
  // let i = 0;
  // db.createReadStream()
  //   .on("data", data => {
  //     i++;
  //   })
  //   .on("error", err => {
  //     return console.log("Unable to read data stream!", err);
  //   })
  //   .on("close", () => {
  //     console.log("Block #" + i);
  //     addLevelDBData(i, value);
  //   });
  return new Promise(
    (resolve, err) => {
      let i = 0;
      db.createReadStream()
        .on("data", data => {
          i++;
        })
        .on("error", err => {
          return console.log("Unable to read data stream!", err);
        })
        .on("close", () => {
          addLevelDBData(i, value);
          resolve(i);
        });
    },
    err => {
      reject("Iam the error", err);
    }
  );
}

function readStream() {
  let i = 0;
  db.createReadStream()
    .on("data", function(data) {
      console.log(data.key, "=", data.value);
    })
    .on("error", function(err) {
      console.log("Oh my!", err);
    })
    .on("close", function() {
      console.log("Stream closed");
    })
    .on("end", function() {
      console.log("Stream ended");
    });
}

module.exports = {
  Blockchain,
  readStream,
  getBlockHeight,
  getLevelDBData
};
//create blockchain
// const blockchain = new Blockchain();
readStream();
// blockchain.addBlock(new Block("sdasds"));
//loop
// (function theLoop(i) {
//   setTimeout(function() {
//     let blockTest = new Block("Test Block - " + (i + 1));
//     blockchain.addBlock(blockTest).then(result => {
//       console.log(result);
//       i++;
//       if (i < 10) theLoop(i);
//     });
//   }, 10000);
// })(0);

//validatechian
// blockchain.validateChain().then(result => {
//   console.log(result);
// });
