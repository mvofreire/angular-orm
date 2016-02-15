(function(r, w){
	'use strict';
	module.exports = require('./core.js');

	if(r)
	{
		module.exports = {};
	}
	else
	{
		w.AngularORM = {};
	}
})((module && module.exports), window);