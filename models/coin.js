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
      allowNull: false,
      unique: true
    },
    fullname: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    creator: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    algorithm: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prooftype: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true
    },
    website: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true
    },
    wikipedia: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    story: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    volume: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    open: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    close: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    high: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    low: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    cc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    marketcap: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'coin',
    timestamps: false,
    underscored : true
  });

  coin.associate = models => {
    coin.hasMany(models.news, {
      foreignKey: "coin_id"
    });
    coin.belongsToMany(models.user,{
      through: {
        model: models.favorites,
        unique: false
      }
    });
    
  }

  return coin;
};
