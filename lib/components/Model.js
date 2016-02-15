(function (){
  var criteria = require('./Criteria');
  var modelCache = {};
  var Promise = require('promise');
  var $app = require('app');
  var storage = $app.Storage.getConnection();

  function getDefaultValue(t){
    if (t.indexOf('INTEGER') > -1) {
      return 0;
    }
    else if (t.indexOf('VARCHAR') > -1) {
      return '';
    }
  }

  function Model(){
    this.storage = storage;
  }

  Model.define = function (t, definitions){
    var classDefined = {}, defCreate = {};

    var model = {};

    Object.setPrototypeOf(model, Model.prototype);

    for (var i in definitions) {
      var _d;
      if (typeof definitions[i] !== 'function') {
        var item = definitions[i];
        model[i] = (angular.isDefined(item.defaultValue) || item.defaultValue === '') ? item.defaultValue : 'null';
        defCreate[i] = item.dataType;
      }
      else {
        model[i] = definitions[i];
      }
    }

    model.setDefinitions({
      attributes:definitions,
      tableName:t
    });

    storage.sync(t, defCreate).then(function (){

    });

    modelCache[t] = model;
    return model;
  };

  Model.prototype._definitions_ = {};
  Model.prototype.setDefinitions = function(definitions){
    this._definitions_ = definitions;
  };
  
  Model.prototype.getDefinitions = function(){
    return this._definitions_;
  };

  Model.prototype.save = function (){
    var self = this;

    function create(){
      return new Promise(function (resolve, reject){
        var bindParams = [], properties = [], values = [];
        var keys = Object.keys(self);
        for (var i in keys) {
          var name = keys[i];
          if (angular.isDefined(self[name]) && typeof self[name] !== 'function' && ["id", "_definitions_"].indexOf(name) === -1) {
            properties.push(name);
            values.push('?');
            bindParams.push(self[name]);
          }
        }

        var query = criteria.from(self.getDefinitions().tableName).toString().insert(properties.join(', '), values.join(', '));
        storage.execute(query, bindParams).then(function (r){
          resolve(r);
        }, function (e){
          reject(e);
        });
      });
    }

    function update(){

      var bindParams = [], sets = '';
      var query = criteria.setType('insert').from(this.getDefinitions().tableName).toString().update(sets);
      return storage.execute(query, bindParams).then(function (result){

      }, function (e){
        console.log(e);
      });
    }

    if (self.id === null) {
      return create();
    }
    else {
      return update();
    }
  };

  Model.prototype.findOne = function (){
    return null;
  };

  Model.prototype.load = function (values){
    var newInstance = angular.copy(modelCache[this.getDefinitions().tableName]);
    for (var name in values) {
      var value = values[name];
      if (newInstance.hasOwnProperty(name)) {
        newInstance[name] = value;
      }
    }
    return newInstance;
  };

  Model.prototype.findAll = function (){
    var self = this;
    var query = criteria.select('*').from(this.getDefinitions().tableName);
    return storage.execute(query).then(function (result){
      var data = [];
      if (result.length > 0) {
        for (i = 0; i < result.length; i++) {
          data.push(self.load(result[i]));
        }
      }
      return data;
    }, function (e){
      console.log('ERROR:', e);
    });
  };

  Model.prototype.dropTable = function (){
    var query = "DROP TABLE " + this.getDefinitions().tableName;
    return storage.execute(query);
  };

  Model.prototype.count = function (filter){
    var query = "SELECT COUNT(id) as total FROM " + this.getDefinitions().tableName;
    return storage.execute(query).then(function (r){
      console.log(r);
    }, function (e){
      console.log(e);
    });
  };

  Model.prototype.getRelation = function (table){
    var self = this;
    var model = modelCache[table];

    if (!model) {
      return Promise.reject('Table Not found');
    }

    return {
      hasOne: function (attr){
        var query = "SELECT * FROM " + table + " WHERE id=?";
        var id = self[attr];
        return storage.execute(query, [id]).then(function (r){
          console.log(r);
          return r;
        }, function (e){
          console.log(e);
          return null;
        });
      },
      hasMany: function (){
        var query = "SELECT * FROM " + table + " WHERE id=?";
        var id = self.id;
        return storage.execute(query, [id]).then(function (r){
          return r;
        }, function (e){
          if ($app.env == 'dev') {
            console.log(e);
            return [];
          }else{
            return [];
          }
        });
      }
    };
  };

  module.exports = Model;
})();
