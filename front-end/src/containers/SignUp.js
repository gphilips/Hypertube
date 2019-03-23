import React from 'react';

import GuestWrapper from "../components/general/GuestWrapper";
import SignUpForm from "../components/form/SignUpForm";

class SignUp extends React.Component {
  render() {
    return (
      <GuestWrapper>
        <SignUpForm />
      </GuestWrapper>
    );
  }
}
export default SignUp;
