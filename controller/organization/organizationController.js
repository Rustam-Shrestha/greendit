// geting sequelize utlity and users datbaase from model
const { sequelize, users } = require("../../model");

//supporting middleware for usung raw query
const {QueryTypes} = require("sequelize");
const generateToken = require("../../services/generateToken");

exports.renderOrganizationForm=(req,res)=>{
    res.render("addorganization")
}

const genRandomNum = ()=>{
    //this will generate random number 0000-8999 added with 1000
    //with floor value of these number or round down
    // basically all random numbers from 0000 to 9999
    return Math.floor(1000+ Math.random()*9000)
}

//SAAS multitenant architecture is different from generic apps
//we need multiple organization from a single user so multiple 
// tables are needed to handle this data
//for uniquely identifying these tables we are using random function and every organization creation will generate a new table not row in table 
exports.createOrganization=async(req,res,next)=>{
    orgNumber = genRandomNum();
    // gibing a primary key to find a user 
    const userId = req.userId

    // find data of above userId 
    const user = await users.findByPk(userId)
    // destructuring all the input field values to access it right away
    const {organizationName, organizationAddress, organizationPhoneNumber, organizationEmail} = req.body;
    // destructuring pan and vat number separately with probable null value because they are not mandatory 
    const organizationPanNumber = req.body.organizationPanNumber || null;
    const organizationVatNumber = req.body.organizationVatNumber || null;




    await sequelize.query(`CREATE TABLE organization_${orgNumber}(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), phoneNumber VARCHAR(255), address VARCHAR(255), panNo VARCHAR(255), vatNo VARCHAR(255) )`,{
        type : QueryTypes.CREATE
    })

    // inserting the destructured data to the table 
    await sequelize.query(`INSERT INTO organization_${orgNumber}(name, email, phoneNumber, address, panNo, vatNo) VALUES(?,?,?,?,?,?)`,{
        type: QueryTypes.INSERT,
        replacements:[organizationName, organizationEmail, organizationPhoneNumber, organizationAddress, organizationPanNumber, organizationVatNumber]
    })
    res.send("successfuly sent")
}