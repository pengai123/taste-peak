const mongoose = require("mongoose");
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const mongodbAtlasUrl = process.env.mongodbAtlasUrl;

mongoose.connect(mongodbAtlasUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true 
});  

const Account = mongoose.model("accounts", {
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
})


module.exports = { Account };
