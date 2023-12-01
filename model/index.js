const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");


const sequelize = new Sequelize('mysql://root@localhost:3306/unknown');
sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// importing model files 
db.users = require("./userModel.js")(sequelize, DataTypes);



db.sequelize.sync({ force: false}).then(() => {
  console.log("yes re-sync done");
});

module.exports = db;