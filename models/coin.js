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
    price: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    volume: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    open: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    close: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    high: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    low: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    change24: {
      type: DataTypes.DECIMAL(5,2),
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
    },
    mc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'coin',
    timestamps: false,
    underscored : true
  });

  coin.associate = models => {
    coin.belongsToMany(models.user,{
      through: {
        model: models.favorites,
        unique: false
      }
    });
    
  }

  return coin;
};
