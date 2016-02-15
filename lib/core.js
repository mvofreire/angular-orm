(function(r, w){
	'use strict';
	
	function AngularOrm()
	{
		return {
			Model:require('./components/Model'),
			Criteria:require('./components/Criteria')
		};
	}

	if(r)
		module.exports = AngularOrm();
	else
		w.AngularORM = AngularOrm();

})((module && module.exports), window);