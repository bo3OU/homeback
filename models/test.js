/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const test =  sequelize.define('test', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      }
    }, {
      tableName: 'test',
      timestamps: false,
      underscored : true
    });

  
    return test;
  };
  