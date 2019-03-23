import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import GuestWrapper from "../components/general/GuestWrapper";
import ResetForm from "../components/form/ResetForm";
import allTheActions from '../actions';

class Reset extends React.Component {
	componentDidMount() {
    const { verifyAccessResetPwd } = this.props.actions.users;
		const { username, token } = this.props.match.params;
		verifyAccessResetPwd({ username, token });
	}

  render() {
		const { username } = this.props.match.params;
		
    return (
      <GuestWrapper bg="reset" cardColor="secondary">
        <ResetForm username={username} />
      </GuestWrapper>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch),
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(Reset);