var express = require('express');
var router = express.Router();

var Order = require(__dirname + '/../models/Product');
var role = require(__dirname + '/../config/Role');

/* GET home page. */
router.get('/', role.auth, function(req, res, next) {
  res.render('index', { title: 'Nakumatt' });
});

router.post('/receive', function(req, res, next){
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

router.get('/orders', role.admin, function(req, res, next) {
  Order.find({})
    .then(function(data){
      res.render('orders/index', {title: "Orders on Nakumatt", orders: data});
    })
    .catch(function(err){
       console.log(err);
    });
});

router.get('/process/:id', role.admin, function(req, res, next) {
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

router.get('/pick/:id', role.auth, function(req, res, next) {
	console.log(req);
	Order.findById(req.params.id)
    .then(function(b){
		b.delivery = true;
		b.deliveryid = res.locals.user.username;
		console.log(b);	    
		b.save(function(err){
			if(err)
				res.redirect('/processed');
			res.redirect('/processed');
		});
    })
    .catch(function(err){
       console.log(err);
    });
});

router.get('/login', function(req, res, next){
	res.render('site/login',{title: "Nakumatt Login"});
});

router.get('/logout', function(req, res){
  req.logout();
  req.session = null;
  res.redirect("/");
  res.end();
});

router.get('/processed', role.auth, function(req, res, next){
	Order.find({
		processed: true,
		delivery: null
	})
    .then(function(data){
      res.render('orders/processed', {title: "Listed orders", orders: data});
    })
    .catch(function(err){
       console.log(err);
    });
});

router.get('/myorders', role.auth, function(req, res, next) {
	Order.find({
		deliveryid: res.locals.user.username
	})
    .then(function(data){
      res.render('orders/processed', {title: "Listed orders", orders: data});
    })
    .catch(function(err){
       console.log(err);
    });
});

module.exports = router;
