/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const user =  sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    login: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
  }, {
    tableName: 'user',
    timestamps: false,
    underscored : true,
    classMethods: {
      associate: (models) => {
        
      }
    }
  });


  user.associate = models => {
    user.hasMany(models.coin_data);
  }
  return user;
};
