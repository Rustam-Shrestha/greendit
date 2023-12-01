module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull : false
      },
      currentOrgNum: {
        type: DataTypes.STRING,
        allowNull:true
      }

    
    });
    return User;
  };