/**
 * Created by Marcus on 12/02/2016.
 */
(function(){
  module.exports = {
    syntax:'websql',
    type:'select',
    query:{
      select:'*',
      table:null,
      join:null,
      where:null,
      limit:null,
      order:null
    },
    select:function(select){
      var _s = select || '*';
      this.query.select = _s;
      return this;
    },
    from:function(table){
      this.query.table = table;
      return this;
    },
    setType:function(t){
      this.type = t;
      return this;
    },
    toString:function(){
      var obj = this.query;
      return {
        select:function(){
          return "SELECT {select} FROM {table} {where} {order} {limit}".replace(/{(\w+)}/g, function(_,k){
            return (obj[k] && obj[k] !== null)?obj[k]:'';
          })
        },
        insert:function(properties, values){
          obj.properties = properties;
          obj.values = values;
          return "INSERT INTO {table} ({properties}) VALUES ({values})".replace(/{(\w+)}/g, function(_,k){
            return (obj[k] && obj[k] !== null)?obj[k]:'';
          });
        },
        update:function(sets){
          obj.values = values;
          return "UPDATE {table} SET {sets}".replace(/{(\w+)}/g, function(_,k){
            return (obj[k] && obj[k] !== null)?obj[k]:'';
          }).replace('{sets}', sets);
        }
      };
    }
  };
})();
