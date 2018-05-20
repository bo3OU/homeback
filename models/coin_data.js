/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('coin_data', {
    coin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'coin',
        key: 'id'
      }
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      primaryKey: true
    },
    price: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    volume: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    open: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    close: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    high: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    low: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'coin_data',
    timestamps: false,
    underscored : true,
  });
};
