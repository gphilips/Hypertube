import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import GuestWrapper from "../components/general/GuestWrapper";
import SignInForm from "../components/form/SignInForm";
import allTheActions from '../actions';

class Login extends React.Component {
  render() {
    const { actions: { users: { logInUser }}} = this.props;
    return (
      <GuestWrapper>
        <SignInForm logInUser={logInUser} />
      </GuestWrapper>
    );
  }
}

const mapStateToProps = state => ({
  logInErrors: state.users.logInErrors,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);