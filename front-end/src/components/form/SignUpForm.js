import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Field, reduxForm, getFormValues, isInvalid } from "redux-form";
import {
  Content,
  Title,
  Form,
  BtnForm,
  ArrowIcon,
  ChangeStepBtn
} from "../../style/signUpForm";
import {
  ArrowForwardIosRounded as ArrowRightIcon,
  ArrowBackIosRounded as ArrowLeftIcon
} from "@material-ui/icons";
import allTheActions from "../../actions";
import InputText from "../form/InputText";
import InputAvatar from "../form/InputAvatar";

const validateSignUpForm = values => {
  const {
    username,
    email,
    password,
    passwordCfm,
    avatar,
    firstname,
    lastname
  } = values;
  const errors = {};

  if (
    username &&
    !/^(?!.*--.*)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9._-]+$/i.test(username.trim())
  )
    errors.username = "It must contain alphanumeric characters";
  if (username && username.length < 4)
    errors.username = "Username is too short (4 characters minimum)";
  if (username && username.length > 30)
    errors.username = "Username is too long (30 characters maximum)";
  if (email && !/^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.trim()))
    errors.email = "Please enter a valid email";
  if (password && password.length < 8)
    errors.password = "Password is too short (8 characters minimum)";
  if (password && password.length > 30)
    errors.password = "Password is too long (30 characters maximum)";
  if (password && !/(?=.*[0-9])/.test(password))
    errors.password = "It must contain a numeric character";
  if (password && !/(?=.*[!@#$%^&*_-])/.test(password))
    errors.password = "It must contain a special character";
  if (password && !/(?=.*[A-Z])/.test(password))
    errors.password = "It must contain an uppercase character";
  if (password && !/(?=.*[a-z])/.test(password))
    errors.password = "It must contain a lowercase character";
  if (passwordCfm && passwordCfm !== password)
    errors.passwordCfm = "Passwords are not the same";
  if (avatar && avatar.length < 1) errors.avatar = "Avatar is missing";
  if (firstname && firstname.length < 4)
    errors.firstname = "First name is too short (4 characters minimum)";
  if (firstname && firstname.length > 30)
    errors.firstname = "First name is too long (30 characters maximum)";
  if (firstname && !/^(?!.*--.*)[A-Z-]+$/i.test(firstname.trim()))
    errors.firstname = "It must contain alpha characters";
  if (lastname && lastname.length < 4)
    errors.lastname = "Last name is too short (4 characters minimum)";
  if (lastname && lastname.length > 30)
    errors.lastname = "Last name is too long (30 characters maximum)";
  if (lastname && !/^(?!.*--.*)[A-Z-]+$/i.test(lastname.trim()))
    errors.lastname = "It must contain alpha characters";
  return errors;
};

class SignUpForm extends React.Component {
  _isMounted = false;
  state = {
    step: 0,
    avatarPic: ""
  };

  componentDidMount() {
    this._isMounted = true;
  }

  handleSubmit = e => {
    const {
      email,
      password,
      passwordCfm,
      username,
      firstname,
      lastname
    } = this.props.formValues;
    const { registerUser } = this.props.actions.users;
    const { avatarPic } = this.state;
    e.preventDefault();
    registerUser({
      email,
      password,
      passwordCfm,
      username,
      firstname,
      lastname,
      avatar: avatarPic
    });
  };

  handleChange = async e => {
    const { uploadAvatar } = this.props.actions.users;
    if (e.target.files[0]) {
      let file = e.target.files[0];
      await uploadAvatar(file, null);
      if (this._isMounted) {
        this.setState({ avatarPic: this.props.avatar });
      }
    }
  };

  changeStepBtn = () => {
    const { step } = this.state;
    const { pristine, invalid, submitting } = this.props;
    let elems = [];

    if (step === 2) {
      elems.push(
        <BtnForm
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          disabled={pristine || invalid || submitting}
          fullWidth
          key="submitBtn"
        >
          Sign Up
        </BtnForm>
      );
    }
    elems.push(
      <ChangeStepBtn key="changeBtn">
        {step > 0 && (
          <ArrowIcon
            aria-label="Previous step"
            onClick={() => {
              if (this._isMounted) {
                this.setState({ step: step - 1 });
              }
            }}
          >
            <ArrowLeftIcon />
          </ArrowIcon>
        )}
        {step < 2 && (
          <ArrowIcon
            aria-label="Next step"
            onClick={() => {
              if (this._isMounted) {
                this.setState({ step: step + 1 });
              }
            }}
          >
            <ArrowRightIcon />
          </ArrowIcon>
        )}
      </ChangeStepBtn>
    );
    return elems;
  };

  firstStep = () => (
    <div>
      <Field name="username" label="Username" component={InputText} />
      <Field name="email" type="email" label="Email" component={InputText} />
    </div>
  );

  secondStep = () => (
    <div>
      <Field
        name="password"
        type="password"
        label="Password"
        component={InputText}
      />
      <Field
        name="passwordCfm"
        type="password"
        label="Confirm password"
        component={InputText}
      />
    </div>
  );

  thirdStep = () => {
    return (
      <div>
        <Field
          name="avatar"
          label="upload-avatar"
          type="file"
          component={InputAvatar}
          avatarpic={this.state.avatarPic}
          onChange={this.handleChange}
        />
        <Field name="firstname" label="First name" component={InputText} />
        <Field name="lastname" label="Last name" component={InputText} />
      </div>
    );
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { step } = this.state;
    return (
      <Content>
        <Title>Sign Up</Title>
        <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
          {step === 0 && this.firstStep()}
          {step === 1 && this.secondStep()}
          {step === 2 && this.thirdStep()}
          {this.changeStepBtn()}
        </Form>
      </Content>
    );
  }
}

SignUpForm = reduxForm({
  form: "signUpForm",
  validate: validateSignUpForm
})(SignUpForm);

const mapStateToProps = state => ({
  formValues: getFormValues("signUpForm")(state),
  avatar: state.users.avatar,
  invalid: isInvalid("signUpForm")(state)
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm);
