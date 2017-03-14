'use strict';

const utils = require('./utils');
const isFunction = utils.isFunction;
const isArray = utils.isArray;

class Promise {
	constructor(executor){
		if(!isFunction(executor)){
			throw new Error(`The arguments ${executor} is not a function.`);
		}
		const self = this;
		self.status = 'pending';
		self.data = undefined;
		self.resolvedCallbacks = [];
		self.rejectedCallbacks = [];

		function resolve(value){
			if(self.status === 'pending'){
				self.status = 'resolved';
				self.data = value;
				self.resolvedCallbacks.forEach(function(callback){
					if(isFunction(callback)){
						setTimeout(function(){
							callback(value);
						},0);
					}
				});
			}
		}

		function reject(reason){
			if(self.status === 'pending'){
				self.status = 'rejected';
				self.data = reason;
				self.rejectedCallbacks.forEach(function(callback){
					if(isFunction(callback)){
						setTimeout(function(){
							callback(value);
						},0);
					}
				});
			}
		}

		try {
			executor(resolve,reject);
		} catch(err) {
			reject(err);
		}
	}

	then(onResolved,onRejected){
		const self = this;
		const resolvedCallback = isFunction(onResolved) ? onResolved : function (value){return value;};
		const rejectedCallback = isFunction(onRejected) ? onRejected : function (reason){throw reason;};
		function resolveValue(value,resolve,reject){
			if(value instanceof Promise){
				value.then(resolve,reject);
				return;
			}
			resolve(value);
		}
		if(status == 'pending'){
			return new Promise(function(resolve,reject){
				self.resolvedCallback.puhs(function(value){
					try{
						const newValue = resolvedCallback(value);
						resolveValue(newValue,resolve,reject);
					}catch(err){
						reject(err);
					}
				});
				self.rejectedCallback.push(function(reason){
					try{
						const newValue = rejectedCallback(value);
						resolveValue(newValue,resolve,reject);
					}catch(err){
						reject(err);
					}
				});
			});
		}
		if(self.status === 'resolved'){
			return new Promise(function(resolve,reject){
				setTimeout(function(){
					try{
						const newValue = resolvedCallback(self.data);
						resolveValue(newValue,resolve,reject);
					}catch(err){
						reject(err);
					}
				},0);
			});
		}
		if(self.status === 'rejected'){
			return new Promise(function(resolve,reject){
				setTimeout(function(){
					try{
						const newReason = rejectedCallback(data);
						resolveValue(newReason,resolve,reject);
					}catch(err){
						reject(err);
					}
				},0);
			});
		}
	}

	catch(onRejected){
		return this.then(null,onRejected);
	}

	resolve(value){
		if(value instanceof Promise){
			return value;
		}
		return new Promise(function(resolve,reject){
			resolve(value);
		});
	}

	reject(reason){
		return new Promise(function(resolve,reject){
			reject(reason);
		});
	}

	race(values){
		if(!isArray(values)){
			return Promise.reject(new Error('Promise.race needs an Array.'));
		}
		return new Promise(function(resolve,reject){
			values.forEach(function(value){
				Promise.resolve(value).then(resolve,reject);
			});
		});
	}

	all(values){
		if(!isArray(values)){
			return Promise.reject(new Error('Promise.all needs an Array.'));
		}
		return new Promise(function(resolve,reject){
			if(values.length === 0){
				resolve([]);
				return;
			}
			const length = values.length;
			const results = Array(length);
			let remaining = length;
			function resolveValue(value,index){
				Promise.resolve(value).then(function(data){
					results[index] = data;
					if(--remaining === 0){
						resolve(results);
					}
				},reject);
			}
			for(let i=0;i<length;i++){
				resolveValue(values[i],i);
			}
		});
	}
}

module.exports = Promise;