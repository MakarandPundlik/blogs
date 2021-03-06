const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");

const isAuthenticated = (req, res) => {
  const accesstoken = req.body.accesstoken;
  if (!accesstoken) {
    res.json({ msg: "No token provided" });
  } else {
    jwt.verify(
      accesstoken,
      process.env.ACCESS_TOKEN_SECRETE,
      (err, decoded) => {
        if (err) {
          res.json({ msg: "Invalid token" });
        } else {
          return res.json({
            msg: "user has been authenticated",
            isAuthenticated: true,
          });
        }
      }
    );
  }
};
module.exports = isAuthenticated;
