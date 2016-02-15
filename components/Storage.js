(function(){

	function Storage (config)
	{
		this.name = config.name || null;
		this.version = config.version || null;

		if(!this.name || !this.version)
		{
			throw 'Forneça um nome e uma versao';
		}
	}

  Storage.prototype.clean = function(){
    console.log('ERROR');
  };

	module.exports = Storage;
})();
