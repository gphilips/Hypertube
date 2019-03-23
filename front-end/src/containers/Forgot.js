import React from 'react';

import GuestWrapper from "../components/general/GuestWrapper";
import ForgotForm from "../components/form/ForgotForm";

class Forgot extends React.Component {
  render() {
    return (
      <GuestWrapper bg="reset" cardColor="secondary">
        <ForgotForm />
      </GuestWrapper>
    );
  }
}

export default Forgot;