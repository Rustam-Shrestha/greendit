// const dbConfig = require("../config/dbConfig");
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




// // // Import required modules for database configuration
// const { Sequelize: SequelizeInstance, DataTypes } = require("sequelize");

// // Establish connection to the MySQL database
// const databaseConnection = new SequelizeInstance('mysql://root@localhost:3306/unknown');

// // Check database connection
// databaseConnection
//   .authenticate()
//   .then(() => {
//     console.log("Database connection successful!");
//   })
//   .catch((err) => {
//     console.log("Error connecting to the database: " + err);
//   });

// // Create an object to hold Sequelize and database connection instances
// const db = {};

// // Assign Sequelize and database connection instances to the db object
// db.Sequelize = SequelizeInstance;
// db.databaseConnection = databaseConnection;

// // Import the userModel file and initialize the model passing databaseConnection and DataTypes
// db.users = require("./userModel.js")(databaseConnection, DataTypes);

// // Sync all defined models to the database
// // { force: false } ensures that it does not drop tables on every sync
// db.databaseConnection.sync({ force: false }).then(() => {
//   console.log("Database models synchronized successfully");
// });

// // Export the db object to be used in other files
// module.exports = db;
