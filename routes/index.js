var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/receive', function(req, res, next){
	console.log("params console");
	console.log(req.params);

	console.log("Query console");
	console.log(req.query);

	console.log("body console");
	console.log(req.body);
});

module.exports = router;
