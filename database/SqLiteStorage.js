(function (){

  var instance, Storage = require('./Storage');

  function SqLiteStorage(config, plugin){
    Storage.call(this, config || {});

    if (window.cordova)
      instance = plugin.openDB({ name: config.name, version:config.version }); //device
    else
      instance = window.openDatabase(config.name, config.version, 'myMusicScore', 1024 * 1024 * 100); // browser
  }

  SqLiteStorage.prototype = Object.create(Storage);

  SqLiteStorage.prototype.constructor = SqLiteStorage

  SqLiteStorage.prototype.execute = function(query){

    console.log(instance);

    return instance.execute(query);
  };

  SqLiteStorage.prototype.sync = function(tableName, properties){

    console.log(instance);
    var definitions = [];
    for(var i in properties)
    {
      var d = properties[i];
      definitions.push('"'+i+'" '+d);
    }

    var query = 'CREATE TABLE IF NOT EXISTS "'+tableName+'" ('+definitions.join(', ')+');';
    return instance.execute(query).then(function(){
      console.log('Sync Complete');
    });
  };

  module.exports = SqLiteStorage;
})();
