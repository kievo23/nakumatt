var express = require('express');
var router = express.Router();

var Order = require(__dirname + '/../models/Product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/receive', function(req, res, next){

	console.log("body console");
	console.log(req.body);

	Order.create({
		amount: req.body.stkCallback.CallbackMetadata.Item[0].Value,
		phone: req.body.stkCallback.CallbackMetadata.Item[4].Value,
		date: new Date(),
		transcode: req.body.stkCallback.CheckoutRequestID
	}, function(err, rst){
		if(err)
			console.log(err);
		console.log(rst);
	});
});

module.exports = router;
