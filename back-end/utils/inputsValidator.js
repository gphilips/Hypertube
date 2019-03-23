exports.commentsValidator = async req => {
  req
    .checkBody(
      "commentContent",
      "Please enter a valid comment (Not empty, 140 char max)"
    )
    .trim()
    .matches(/^[a-zA-Z0-9 !.?,]*$/)
    .len({ min: 1, max: 140 });
  const validationObj = await req.getValidationResult();
  const errors = validationObj.array();

  return errors.length ? errors : [];
};

exports.signUpValidator = async req => {
  req.checkBody("email", "Email is invalid").isEmail();

  req
    .checkBody(
      "username",
      "Please enter a valid username (4 chars min and 30 chars max)"
    )
    .trim()
    .matches(/^(?!.*--.*)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9._-]+$/i)
    .len({ min: 4, max: 30 });

  req
    .checkBody(
      "firstname",
      "Please enter a valid first name (4 chars min and 30 chars max)"
    )
    .trim()
    .matches(/^(?!.*--.*)[a-zA-Z-]*$/)
    .len({ min: 4, max: 30 });

  req
    .checkBody(
      "lastname",
      "Please enter a valid last name (4 chars min and 30 chars max)"
    )
    .trim()
    .matches(/^(?!.*--.*)[a-zA-Z-]*$/)
    .len({ min: 4, max: 30 });

  req
    .checkBody(
      "password",
      "Please enter a valid password with alphanumeric and special chars"
    )
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*éèçàù_-]+$/
    )
    .len({ min: 8, max: 30 });

  req
    .checkBody(
      "passwordCfm",
      "Confirmation password is not the same as password"
    )
    .equals(req.body.password);

  req.checkBody("avatar", "Avatar is missing").notEmpty();

  const validationObj = await req.getValidationResult();
  const errors = validationObj.array();

  return errors.length ? errors : [];
};

exports.signInValidator = async req => {
  req
    .checkBody(
      "username",
      "Please enter a valid username (4 chars min and 30 chars max)"
    )
    .trim()
    .matches(/^(?!.*--.*)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9._-]+$/i)
    .len({ min: 4, max: 30 });
  req
    .checkBody(
      "password",
      "Please enter a valid password with alphanumeric and special chars"
    )
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*éèçàù_-]+$/
    )
    .len({ min: 8, max: 30 });

  const validationObj = await req.getValidationResult();
  const errors = validationObj.array();

  return errors.length ? errors : [];
};

exports.forgotValidator = async req => {
  req.checkBody("email", "The email is invalid").isEmail();
  const validationObj = await req.getValidationResult();
  const errors = validationObj.array();
  return errors.length ? errors : [];
};

exports.verifyAccessResetValidator = async req => {
  req
    .checkQuery("username", "The username is invalid")
    .trim()
    .matches(/^(?!.*--.*)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9._-]+$/i)
    .len({ min: 4, max: 30 });
  req.checkQuery("token", "The token is invalid").len({ min: 16, max: 16 });
  const validationObj = await req.getValidationResult();
  const errors = validationObj.array();
  return errors.length ? errors : [];
};

exports.resetPwdValidator = async req => {
  req
    .checkBody("username", "The username is invalid")
    .trim()
    .matches(/^(?!.*--.*)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9._-]+$/i)
    .len({ min: 4, max: 30 });
  req
    .checkBody(
      "password",
      "Please enter a valid password with alphanumeric and special chars"
    )
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*éèçàù_-]+$/
    )
    .len({ min: 8, max: 30 });
  req
    .checkBody(
      "passwordCfm",
      "Confirmation password is not the same as password"
    )
    .equals(req.body.password);
  const validationObj = await req.getValidationResult();
  const errors = validationObj.array();
  return errors.length ? errors : [];
};

exports.FormEditValidator = async req => {
  req
    .checkBody("username", "The username is invalid")
    .trim()
    .matches(/^(?!.*--.*)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9._-]+$/i)
    .len({ min: 4, max: 30 });
  req
    .checkBody("firstname", "The firstname is invalid")
    .trim()
    .matches(/^(?!.*--.*)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9._-]+$/i)
    .len({ min: 4, max: 30 });
  req
    .checkBody("lastname", "The lastname is invalid")
    .trim()
    .matches(/^(?!.*--.*)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9._-]+$/i)
    .len({ min: 4, max: 30 });
  req.checkBody("email", "Email is invalid").isEmail();
  const validationObj = await req.getValidationResult();
  const errors = validationObj.array();
  return errors.length ? errors : [];
};
