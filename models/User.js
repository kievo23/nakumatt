const mongoose = require('mongoose');

var sys = require(__dirname + '/../config/System');
var db = mongoose.connect(sys.db_uri, {useMongoClient: true });
mongoose.Promise =require('bluebird');

const Schema = mongoose.Schema;

const userSchema = new Schema({
		username: { type: String,required: true, index: { unique: true, sparse: true }},
		names: String,
        googleid: {type:String},
		phone: String,
		password: String,
		role: String,
		email: String,
		website: String,
		postal: String
});

module.exports = mongoose.model('User', userSchema);