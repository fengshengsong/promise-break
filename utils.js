'use strict'

const toString = Object.prototype.toString;

module.exports = {
	isFunction:function(obj){
		return toString.call(obj) === '[object Function]';
	},
	isArray:function(obj){
		return toString.call(obj) === '[object Array]';
	}
}


