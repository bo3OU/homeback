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
      allowNull: true,
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
      type: DataTypes.DECIMAL(20,10),
      allowNull: true
    },
    volume: {
      type: DataTypes.DECIMAL(20,2),
      allowNull: true
    },
    open: {
      type: DataTypes.DECIMAL(20,10),
      allowNull: true
    },
    close: {
      type: DataTypes.DECIMAL(20,10),
      allowNull: true
    },
    high: {
      type: DataTypes.DECIMAL(20,10),
      allowNull: true
    },
    low: {
      type: DataTypes.DECIMAL(20,10),
      allowNull: true
    },
    cc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null
    },
    marketcap: {
      type: DataTypes.DECIMAL(20,2),
      allowNull: true
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
