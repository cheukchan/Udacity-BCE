const level = require("level");
const SHA256 = require("crypto-js/sha256");
var { Block } = require("./block");

const chainDB = "./messageData";

const db = level(chainDB, { valueEncoding: "json" });

class MessageChain {
  constructor() {

  }

  // Add new block
  async addBlock(address, data) {
    addLevelDBData(address, data)
  }

  async getBlock(blockHeight) {
    const data = await getLevelDBData(blockHeight);
    return data;
  }

  findMessageData(address) {
    return new Promise(
      (resolve, reject) => {
        let i = 0;
        db.createReadStream()
          .on("data", data => {
            console.log(data.key, "=1", data.value);
            console.log('hash' + data.value.address)
            console.log(address)
            if(data.key === address){
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
  MessageChain,
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
