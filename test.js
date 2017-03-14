
const Promise = require('./promise');

var promise = new Promise(function(resolve,reject){
	setTimeout(function(){
		console.log('yes');
		resolve('no');
	},100);
});