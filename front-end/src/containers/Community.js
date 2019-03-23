import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import styled from "styled-components";
import InfiniteScroll from 'react-infinite-scroller';

import allTheActions from '../actions';
import defaultAvatar from "../img/avatar.jpg";

const Wrapper = styled.div`
	margin-top: 5em;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	text-align: center;
`;
const UserLink = styled(Link)`
	text-decoration: none;
	color: ${props => props.theme.color.secondary};
`;
const UserAvatar = styled.img`
	border-radius: 3%;
  border: 1px solid ${props => props.theme.color.text};
`;
const LinkLabel = styled.p`
	margin-top: 0;
`;
const Label = styled.p`
	color: ${props => props.theme.color.darkText}
`;

export class Community extends React.Component {
	renderUsersProfile = () => {
		const { usersProfile } = this.props;
		if (usersProfile && usersProfile[0]) {
			return usersProfile.map((profile, i) => {
				const { avatar, username } = profile;
				return (
					<div key={i}>
						<UserLink to={`/profiles/${username}`}>
							<UserAvatar src={avatar || defaultAvatar} alt="avatar" width="150" />
							<LinkLabel>{username}</LinkLabel>
						</UserLink>
					</div>
				);
			});
		}
		else {
			return <Label>Sorry but there is no user yet.</Label>
		}
	}

	UNSAFE_componentWillMount() {
		const { getMoreProfiles } = this.props.actions.users;
		const { usersProfile } = this.props;
		if (!usersProfile[0]) getMoreProfiles(1);
	}

  render() {
		const {
			hasMoreProfiles,
			actions: { users: { getMoreProfiles } }
		} = this.props;
		return (
			<InfiniteScroll
				pageStart={1}
				loadMore={getMoreProfiles}
				hasMore={hasMoreProfiles}
				loader={<Label>Loading ...</Label>}
			>
			<Wrapper>
				{this.renderUsersProfile()}
			</Wrapper>
			</InfiniteScroll>
		);
  }
}

const mapStateToProps = state => ({
	usersProfile: state.users.usersProfile.profiles,
	hasMoreProfiles: state.users.usersProfile.hasMoreProfiles,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch),
  },
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Community);