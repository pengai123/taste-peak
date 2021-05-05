const { Account } = require("./index.js");

let newAccount = (userObj, cb = () => {}) => {
	Account.create(userObj)
	.then(result => cb(null, result))
	.catch(err => cb(err))
}


let findAccount = (userObj, cb = () => {}) => {
	Account.findOne(userObj) 
	.then(result => cb(null, result))
	.catch(err => cb(err))
}

module.exports = {
	newAccount,
	findAccount
}
