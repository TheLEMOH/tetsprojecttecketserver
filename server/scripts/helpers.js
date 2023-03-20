const helpers = {
    isComparableField: key => key[0] !== '_',
  
    getFieldKey: (key) => {
      let result = key;
      if (key.indexOf('.') !== -1) {
        result = `$${key}$`;
      }
  
      return result;
    },
  
    getEqualOp: (key, value) => {
      const query = {
        [key]: value,
      };
  
      return query;
    },

  };
  
  module.exports = helpers;