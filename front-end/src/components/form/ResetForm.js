import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Field, reduxForm, getFormValues, isInvalid } from "redux-form";
import styled from "styled-components";
import { CardContent, Button } from "@material-ui/core";

import allTheActions from "../../actions";
import InputText from "./InputText";

const Content = styled(CardContent)`
  display: flex;
  flex: 1;
  margin: 0 40px;
  flex-direction: column;
`;
const Title = styled.h1`
  font-size: ${props => props.theme.fontSize.big};
  color: ${props => props.theme.color.black};
  display: flex;
  justify-content: flex-start;
`;

const BtnForm = styled(Button)`
	color: ${props => props.theme.color.text};
	 background-color:#e50914 !important
	margin: 30px 0 15px;
	&:hover {
		  background-color: #b5313a !important
	}
	&:disabled {
		color: ${props => props.theme.color.text};
		 background-color:#e50914 !important
	}
`;
const Label = styled.p`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
`;

const validateResetForm = values => {
  const { password, passwordCfm } = values;
  const errors = {};

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
  return errors;
};

class ResetForm extends React.Component {
  handleSubmit = e => {
    const { password, passwordCfm } = this.props.formValues;
    const {
      username,
      actions: {
        users: { resetPassword }
      }
    } = this.props;
    e.preventDefault();
    resetPassword({ password, passwordCfm, username });
  };

  render() {
    const { submitting, pristine, invalid } = this.props;
    return (
      <Content>
        <Title>Reset your password</Title>
        <Label>Enter your new password</Label>

        <form onSubmit={this.handleSubmit}>
          <Field
            type="password"
            name="password"
            label="Password"
            redErrorColor
            component={InputText}
          />
          <Field
            type="password"
            name="passwordCfm"
            label="Confirm password"
            redErrorColor
            component={InputText}
          />
          <BtnForm
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            disabled={pristine || invalid || submitting}
            fullWidth
          >
            Reset Password
          </BtnForm>
        </form>
      </Content>
    );
  }
}

ResetForm = reduxForm({
  form: "resetForm",
  validate: validateResetForm
})(ResetForm);

const mapStateToProps = state => ({
  formValues: getFormValues("resetForm")(state),
  invalid: isInvalid("resetForm")(state)
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetForm);
