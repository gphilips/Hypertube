import React from 'react';
import styled from "styled-components";
import { Card, CardContent, Button } from '@material-ui/core';
import { Field, reduxForm } from "redux-form";

import InputText from "../form/InputText";

const Wrapper = styled(Card)`
  width: 40vw;
  height: 10vh;
  min-width: 233px;
  min-height: 460px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
`;
const Content = styled(CardContent)`
  display: flex;
  flex: 1;
  margin: 0 40px;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize.h1};
  color: ${props => props.theme.color.text};
  display: flex;
  justify-content: flex-start;
`;

const BtnForm = styled(Button)`
  background-color: ${props => props.theme.color.primary};
  margin: 30px 0;
  &&:hover {
    background-color: ${props => props.theme.color.primary};
  }
`;

const validateSignInForm = values => {
  const { email, password } = values;
  const errors = {};

  if (email && !/^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email))
    errors.email = 'Invalid email';
  if (password && password.length < 8)
    errors.password = 'Password is too short (8 characters minimum)';
  return errors;
}

class SignInForm extends React.Component {
  state = {
    email: '',
    password: '',
  }

  handleChange = ({ target: { name, value } }) => {
    return this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    const { logInUser } = this.props;
    const { email, password } = this.state;
    
    e.preventDefault();
    logInUser({
      email: email.trim(),
      password: password.trim(),
    });
  }

  render() {
    const { submitting } = this.props;

    return (
      <Wrapper>
        <Content>
          <Title>Sign In</Title>
            <form onSubmit={this.handleSubmit}>
              <Field
                name="email"
                type="email"
                label="Email"
                component={InputText}
                onChange={this.handleChange}
              />
              <Field
                name="password"
                type="password"
                label="Password"
                component={InputText}
                onChange={this.handleChange}
              />
              <BtnForm
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                disabled={submitting}
                fullWidth
              >
                Sign in
              </BtnForm>
            </form>
        </Content>
      </Wrapper>
    );
  }
}

export default reduxForm({
  form: 'signInForm',
  validate: validateSignInForm,
})(SignInForm);