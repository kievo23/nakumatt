const mongoose = require('mongoose');

var sys = require(__dirname + '/../config/System');
var db = mongoose.connect(sys.db_uri, {useMongoClient: true });
mongoose.Promise =require('bluebird');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	amount: String,
	phone: String,
	date: Date,
	trancode: String,
	processed: Boolean,
	delivery: String,
	deliveryid: String
});

module.exports = mongoose.model('Order', orderSchema);