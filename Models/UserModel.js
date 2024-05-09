const { DataTypes, Model } = require('sequelize');
const sequelize = require("../Config/DB-Connect");

class User extends Model {}

User.init(
  {
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // fingerprints: {
    //   type: DataTypes.ARRAY(DataTypes.STRING),
    // },
    otp: {
      type: DataTypes.STRING,
    },
    userType: {
      type: DataTypes.ENUM('Plumber', 'User', 'Electrician', 'Carpenter'),
      defaultValue: 'User',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

module.exports = User;
