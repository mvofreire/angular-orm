/**
 * Created by Marcus on 13/02/2016.
 */
(function(){

  function LocalStorage()
  {
    var instance = window.localStorage;
    this.get = function(key){
      if(instance.hasOwnProperty(key))
        return JSON.parse(instance.getItem(key));
      else
        return null;
    };

    this.set = function(key, value){
      instance.setItem(key, JSON.stringify(value));
    };
  }

  module.exports = LocalStorage;
})();
