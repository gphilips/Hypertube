import React from 'react';
import GuestWrapper from "../components/general/GuestWrapper";
import SignInForm from "../components/form/SignInForm";
import { history } from "../config/store";

class Login extends React.Component {
  componentDidMount() {
    if (localStorage.getItem('Authorization')) {
      history.push("/");
    }
  }
  render() {
    return (
      <GuestWrapper>
        <SignInForm />
      </GuestWrapper>  
    );
  }
}

export default Login;