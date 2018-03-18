var express = require('express');
var router = express.Router();

var Order = require(__dirname + '/../models/Product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/receive', function(req, res, next){

	console.log("body console");
	console.log(req.body.Body);

	Order.create({
		transcode: req.body.Body.stkCallback.CheckoutRequestID,
		amount: req.body.Body.stkCallback.CallbackMetadata.Item[0].Value,
		phone: req.body.Body.stkCallback.CallbackMetadata.Item[4].Value,
		date: new Date()		
	}, function(err, rst){
		if(err)
			console.log(err);
		console.log(rst);
	});
	res.redirect('/');
});

router.get('/orders', function(req, res, next) {
  Order.find({})
    .then(function(data){
      res.render('orders/index', {title: "Orders on Nakumatt", orders: data});
    })
    .catch(function(err){
       console.log(err);
    });
});

router.get('/process/:id', function(req, res, next) {
	Order.findById(req.params.id)
    .then(function(b){
		b.processed = true;	    
		b.save(function(err){
			if(err)
				res.redirect('/orders');
			res.redirect('/orders');
		});
    })
    .catch(function(err){
       console.log(err);
    });
});

router.get('/login', function(req, res, next){
	res.render('site/login',{title: "Nakumatt Login"});
});

app.get('/logout', function(req, res){
  req.logout();
  req.session = null;
  res.redirect("/");
  res.end();
});

router.get('/processed', function(req, res, next) {
	Order.find({
		processed: true
	})
    .then(function(data){
      res.render('orders/processed', {title: "Listed orders", orders: data});
    })
    .catch(function(err){
       console.log(err);
    });
});

module.exports = router;
