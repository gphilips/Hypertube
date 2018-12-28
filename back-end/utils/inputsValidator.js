exports.signUpValidator = async (req) => {
  req.checkBody('email', 'Email is invalid').isEmail()

  req.checkBody('username', 'User name is invalid (4 chars min and 255 chars max)')
    .trim()
    .matches(/^[a-zA-Z0-9]*$/)
    .len({ min: 4, max: 255 })

  req.checkBody('firstname', 'First name is invalid (4 chars min and 255 chars max)')
    .trim()
    .matches(/^[a-zA-Z0-9]*$/)
    .len({ min: 4, max: 255 })

  req.checkBody('lastname', 'Last name is invalid (4 chars min and 255 chars max)')
    .trim()
    .matches(/^[a-zA-Z0-9]*$/)
    .len({ min: 4, max: 255 })

  req.checkBody('password', 'Password is invalid (8 chars min and 255 chars max)')
    .len({ min: 8, max: 255 })

  req.checkBody('passwordCfm', 'Confirmation password is not the same as password')
    .equals(req.body.password)

  const validationObj = await req.getValidationResult();
  const errors = validationObj.array();

  return (errors.length) ? errors : [];
};

exports.signInValidator = async (req) => {
  req.checkBody('email', 'Email is invalid').isEmail()

  req.checkBody('password', 'Password is invalid (8 chars min and 255 chars max)')
    .len({ min: 8, max: 255 })

  const validationObj = await req.getValidationResult();
  const errors = validationObj.array();

  return (errors.length) ? errors : [];
}