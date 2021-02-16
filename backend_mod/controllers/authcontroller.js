const userSchema = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const createAccessToken = require('../middlewares/tokenMiddlewares');


//signup handler
module.exports.signup_post = (req, res) => {
    const { firstname, lastname, email, password, remember } = req.body;
    console.log(email, remember);
    //common error object
    let errors = { email: '', password: '' };
    //check for the existing user
    userSchema.findOne({ email })
        .then((user) => {
            if (user) {

                errors.email = "User already exists";

                res.json({ errors: errors });
            }

            else {
                const newUser = new userSchema({
                    firstname,
                    lastname,
                    email,
                    password
                });

                //hash passwords before saving to the database
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        errors.password = "Something went wrong while hashing";

                        res.json({ errors: errors });
                    }
                    else {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                errors.password = "Something went wrong while hashing";

                                res.json({ errors: errors });
                            }
                            else {
                                newUser.password = hash;
                                newUser.save();


                                //create accesstoken  for user
                                const accesstoken = createAccessToken(newUser);
                               
                                res.json({ msg: "user registered successfully", username: newUser.firstname ,accesstoken});
                            }
                        })
                    }
                })


            }
        })
        .catch((err) => console.log(err));

}

//login handler
module.exports.login_post = (req, res) => {
    const { email, password } = req.body;
    let errors = { email: '', password: '' };
    console.log(req.body);
    //check for the existing email
    userSchema.findOne({ email })
        .then((user) => {
            if (!user) {
                errors.email = "User does not exists";

                res.json({ errors: errors });
            }
            else {
                //check the hasged passwords
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err || !isMatch) {
                        errors.password = "Please Enter the valid password";

                        res.json({ errors: errors });
                    }
                    else {

                        //create accesstoken  for user
                        const accesstoken = createAccessToken(user);
                        
                        res.json({ msg: "user logged in successfully", username: user.firstname ,accesstoken});
                    }
                })
            }
        })
        .catch((err) => console.log(err));

}

