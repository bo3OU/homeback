/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const coin =  sequelize.define('coin', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fullname: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    creator: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    algorithm: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    prooftype: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    website: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    wikipedia: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    story: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'coin',
    timestamps: false,
    underscored : true
  });

  coin.associate = models => {
    coin.hasMany(models.coin_data);
  }
  return coin;
};
