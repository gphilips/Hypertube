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

// background-color: ${props => props.theme.color.blue}; par background-color:#dc1b28
const BtnForm = styled(Button)`
  color: ${props => props.theme.color.text};
  background-color:#e50914
 
  margin: 30px 0 15px;
  &:hover {
    background-color: #b5313a
  }
  &:disabled {
    color: ${props => props.theme.color.text};
    background-color:#e50914
  }
`;

const Label = styled.p`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
`;

const validateForgotForm = values => {
  const { email } = values;
  const errors = {};

  if (email && !/^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.trim()))
    errors.email = "Please enter a valid email";
  return errors;
};

class ForgotForm extends React.Component {
  handleSubmit = e => {
    const { sendForgotEmail } = this.props.actions.users;
    const { email } = this.props.formValues;
    e.preventDefault();
    sendForgotEmail(email);
  };

  render() {
    const { submitting, pristine, invalid } = this.props;
    return (
      <Content>
        <Title>Forgot Password</Title>
        <Label>
          We will send you an email with instructions on how to reset your
          password.
        </Label>
        <form onSubmit={this.handleSubmit}>
          <Field
            name="email"
            label="Email"
            type="email"
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
            Email Me
          </BtnForm>
        </form>
      </Content>
    );
  }
}

ForgotForm = reduxForm({
  form: "forgotForm",
  validate: validateForgotForm
})(ForgotForm);

const mapStateToProps = state => ({
  formValues: getFormValues("forgotForm")(state),
  invalid: isInvalid("forgotForm")(state)
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotForm);
