const { renderOrganizationForm, createOrganization } = require("../controller/organization/organizationController");

const router = require("express").Router()
//when get requestt is made it will give form to input
//when post request is made new organization is made with respect to values providedd in input boxes
router.route("/organization").get(renderOrganizationForm).post(createOrganization);

module.exports = router;