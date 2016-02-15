/**
 * Created by Marcus on 10/02/2016.
 */
(function () {
  var instance, Storage = require('./Storage');

  function PouchDbStorage(config, plugin) {
    Storage.call(this, config || {});
    instance = plugin;
  }

  PouchDbStorage.prototype = Object.create(Storage);
  PouchDbStorage.prototype.constructor = PouchDbStorage;
  module.exports = PouchDbStorage;
})();
