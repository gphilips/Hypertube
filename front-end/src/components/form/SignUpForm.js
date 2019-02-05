import React from 'react';
import styled from "styled-components";
import { Field, reduxForm } from "redux-form";
import {
  Card,
  CardContent,
  Button,
  IconButton,
} from '@material-ui/core';
import {
  ArrowForwardIosRounded as ArrowRightIcon,
  ArrowBackIosRounded as ArrowLeftIcon,
} from '@material-ui/icons';

import InputText from "../form/InputText";
import InputRadio from "../form/InputRadio";

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
const ArrowIcon = styled(IconButton)`
  color: ${props => props.theme.color.primary};
  background-color: ${props => props.theme.color.secondary};
  &&: hover {
    background-color: ${props => props.theme.color.secondary};
  }
`;
const ChangeStepBtn = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-around;
  margin-top: 30px;
`;

const validateSignUpForm = values => {
  const { username, email, password } = values;
  const errors = {};

  if (username && !/^[A-Z0-9]+$/i.test(username))
    errors.username = 'Invalid username)';
  if (username && username.length < 8)
    errors.username = 'Username is too short (8 characters minimum)';
  if (email && !/^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email))
    errors.email = 'Invalid email';
  if (password && password.length < 8)
    errors.password = 'Password is too short (8 characters minimum)';
  return errors;
}

class SignUpForm extends React.Component {
  state = {
    step: 0,
    username: '',
    email: '',
    password: '',
    firstname: '',
    lasttname: '',
    gender: '',
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

  changeStepBtn = () => {
    const { step } = this.state;
    const { submitting } = this.props;

    if (step === 2) {
      return (
        <BtnForm
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          disabled={submitting}
          fullWidth
        >
          Sign Up
        </BtnForm>
      );
    }
    return (
      <ChangeStepBtn>
        {step > 0 && (
          <ArrowIcon
            aria-label="Previous step"
            onClick={() => this.setState({ step : step - 1 })}
          >
          <ArrowLeftIcon />
        </ArrowIcon>
        )}
        {step < 2 && (
          <ArrowIcon
            aria-label="Next step"
            onClick={() => this.setState({ step : step + 1 })}
          >
          <ArrowRightIcon />
        </ArrowIcon>
        )}
      </ChangeStepBtn>
    )
  }

  firstStep = () => (
    <div>
      <Field
        name="username"
        label="Username"
        component={InputText}
        onChange={this.handleChange}
      />
        <Field
          name="email"
          type="email"
          label="Email"
          component={InputText}
          onChange={this.handleChange}
        />
    </div>
  );

  secondStep = () => (
    <div>
      <Field
        name="password"
        type="password"
        label="Password"
        component={InputText}
        onChange={this.handleChange}
      />
      <Field
        name="passwordCfm"
        type="password"
        label="Confirm password"
        component={InputText}
        onChange={this.handleChange}
      />
    </div>
  );

  thirdStep = () => {
    const { gender } = this.state;
    const inputs = ['male', 'female', 'both'];
    return (
      <div>
        <Field
          name="firstname"
          label="First name"
          component={InputText}
          onChange={this.handleChange}
        />
        <Field
          name="lastname"
          label="Last name"
          component={InputText}
          onChange={this.handleChange}
        />
        <Field
          name="gender"
          label="Gender"
          inputs={inputs}
          component={InputRadio}
          value={gender}
          onChange={this.handleChange}
        />
      </div>
    );
  };

  render() {
    const { step } = this.state;
    return (
      <Wrapper>
        <Content>
          <Title>Sign Up</Title>
            <form onSubmit={this.handleSubmit}>
              {step === 0 && this.firstStep()}
              {step === 1 && this.secondStep()}
              {step === 2 && this.thirdStep()}
              {this.changeStepBtn()}
            </form>
        </Content>
      </Wrapper>
    );
  }
}

export default reduxForm({
  form: 'signUpForm',
  validate: validateSignUpForm,
})(SignUpForm);