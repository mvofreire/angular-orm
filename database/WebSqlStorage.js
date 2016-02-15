/**
 * Created by Marcus on 12/02/2016.
 */
(function (){
  var instance,
    Storage = require('./Storage'),
    Promise = require('promise');

  function WebSqlStorage(config){
    Storage.call(this, config || {});
    instance = window.openDatabase(config.name, config.version, 'myMusicScore', 1024 * 1024 * 100); // browser
  }

  WebSqlStorage.prototype = Object.create(Storage);

  WebSqlStorage.prototype.constructor = WebSqlStorage

  WebSqlStorage.prototype.execute = function (query, params){
    var _q;

    if(typeof query === 'object')
      _q = query.toString().select();
    else
      _q = query;
    console.log(_q);

    return new Promise(function (resolve, reject){
      instance.transaction(function (tx){
        tx.executeSql(_q, params || [], function (t, result){
          //success
          var data = [];
          if (result.rows.length > 0) {
            for (i = 0; i < result.rows.length; i++)
              data.push(result.rows.item(i));
          }
          resolve(data);
        }, function (t, e){
          //error
          reject(e);
        });
      });
    });
  };

  WebSqlStorage.prototype.sync = function (tableName, properties){
    var definitions = WebSqlStorage.normalizeProperties(properties);
    var query = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + definitions + ')';
    return this.execute(query);
  };

  WebSqlStorage.prototype.clean = function (done, error){
    var self = this;
    var query = "SELECT * from sqlite_master WHERE type = 'table'";
    return this.execute(query).then(function(r){
      var l = [];
      for(var i in r)
      {
        var table = r[i];
        if(table.name.indexOf('_') !== 0)
        {
          var drop = "DROP TABLE "+table.name;
          self.execute(drop).then(function(){
            l.push(table);
          });
        }
      }
      done(l);
    }, function(e){
      error(e);
    });
  };

  WebSqlStorage.propertyCast = {
    "INTEGER PRIMARY KEY NOT NULL": "INTEGER PRIMARY KEY",
    "VARCHAR(45)": "VARCHAR",
    "INTEGER": "INTEGER",
    "TEXT": "VARCHAR"
  };

  WebSqlStorage.normalizeProperties = function (p){
    var definitions = [];
    for (var i in p) {
      var d = (p[i] in WebSqlStorage.propertyCast) ? WebSqlStorage.propertyCast[p[i]] : p[i];
      definitions.push(i + ' ' + d);
    }
    return definitions.join(', ');
  };

  module.exports = WebSqlStorage;
})();
