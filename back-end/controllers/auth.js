const User = require('../models/User');
const { signUpValidator } = require('../utils/inputsValidator');
const { sendSignUpMail } = require('../utils/sendMail');

exports.signUpUser = async (req, res) => {
  const { email, password, username, firstname, lastname } = req.body;

  const errors = await signUpValidator(req);
  if (errors.length)
    return res.send({ success: false, errors });
  
  const user = new User({
    email,
    password,
    username,
    firstname,
    lastname,
  });

  User.findOne({ email }, (err, userExist) => {
    if (err) throw err;
    if (userExist) {
      return res.send({
        success: false,
        errors: [{
          param: "email",
          message: "This email is already used.",
        }]
      });
    }
    user.save((err) => {
      if (err) throw err;
      sendSignUpMail(email, username);
      return res.send({ success: true, errors: [] });
    });
  })
};

exports.forgotPwdUser = (req, res) => {

};

exports.resetPwdUser = (req, res) => {

};