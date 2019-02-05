import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import GuestWrapper from "../components/general/GuestWrapper";
import SignUpForm from "../components/form/SignUpForm";
import allTheActions from '../actions';

class SignUp extends React.Component {
  render() {
    const { actions: { users: { logInUser }}} = this.props;
    return (
      <GuestWrapper>
        <SignUpForm logInUser={logInUser} />
      </GuestWrapper>
    );
  }
}

const mapStateToProps = state => ({
  signUpErrors: state.users.signUpErrors,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUp);
