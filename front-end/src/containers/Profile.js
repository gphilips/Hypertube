import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  Wrapper,
  UserInfos,
  Avatar,
  Content,
  Title,
  Text,
  UsernameText,
  ActionBtn,
  EmailIcon,
  UpdateIcon,
  LanguageIcon
} from "../style/userProfile";
import moment from "moment";
import "moment/locale/fr";
import allTheActions from "../actions";
import Slider from "../components/moviesList/MovieSlider";
import EditForm from "../components/form/EditForm";
import EditResetForm from "../components/form/EditResetForm";
import Alert from "../components/general/Alert";
import defaultAvatar from "../img/avatar.jpg";
import { Wrapper as SliderWrapper, Label } from "../style/movieSlider";

class Profile extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      moviesWatched: "",
      moviesWatching: ""
    };
  }
  async componentDidUpdate(prevProps) {
    const { username } = this.props.match.params;
    if (username !== prevProps.match.params.username) {
      const { getCurrentProfile } = this.props.actions.users;
      getCurrentProfile(username);
      const { deleteMoviesDB } = this.props.actions.movies;
      await deleteMoviesDB();
      const { getMoviesDB } = this.props.actions.movies;
      let moviesWatched = [];
      let moviesWatching = [];
      if (username) await getCurrentProfile(username);
      await getMoviesDB(this.props.user.movies);
      if (this.props.moviesDBInfo) {
        let moviesDBInfo = this.props.moviesDBInfo;
        moviesDBInfo.forEach(movieDB => {
          if (
            movieDB &&
            movieDB.userMovies &&
            !movieDB.userMovies.isFinished &&
            movieDB.userMovies.currentTime
          ) {
            moviesWatching = moviesWatching.concat(movieDB);
          } else if (
            movieDB &&
            movieDB.userMovies &&
            movieDB.userMovies.isFinished
          ) {
            moviesWatched = moviesWatched.concat(movieDB);
          }
        });
      }
      if (this._isMounted) {
        await this.setState({ moviesWatched, moviesWatching });
      }
    }
  }

  async componentDidMount() {
    this._isMounted = true;
    const { username } = this.props.match.params;
    const { getCurrentProfile } = this.props.actions.users;
    const { getMoviesDB } = this.props.actions.movies;
    let moviesWatched = [];
    let moviesWatching = [];
    if (username) await getCurrentProfile(username);
    await getMoviesDB(this.props.user.movies);
    if (this.props.moviesDBInfo) {
      let moviesDBInfo = this.props.moviesDBInfo;
      moviesDBInfo.forEach(movieDB => {
        if (
          movieDB &&
          movieDB.userMovies &&
          !movieDB.userMovies.isFinished &&
          movieDB.userMovies.currentTime
        ) {
          moviesWatching = moviesWatching.concat(movieDB);
        } else if (
          movieDB &&
          movieDB.userMovies &&
          movieDB.userMovies.isFinished
        ) {
          moviesWatched = moviesWatched.concat(movieDB);
        }
      });
    }
    if (this._isMounted) {
      await this.setState({ moviesWatched, moviesWatching });
    }
  }

  async componentWillUnmount() {
    const { deleteMoviesDB } = this.props.actions.movies;
    await deleteMoviesDB();
    this._isMounted = false;
  }

  loadDefaultAvatar = (e) => {
    e.target.src = defaultAvatar;
}

  render() {
    const { deleteAccount } = this.props.actions.users;
    const { isMyProfile, myAccount, user } = this.props;
    let infos = isMyProfile ? myAccount : user;
    const {
      avatar,
      firstname,
      lastname,
      username,
      createdAt,
      email,
      lang
    } = infos;
    const { moviesWatched, moviesWatching } = this.state;
    moment.locale(lang);
    const time = moment.utc(createdAt).format("LLL");
    return (
      <Wrapper>
        <UserInfos>
          <Avatar src={avatar || defaultAvatar} alt="avatar" onError={this.loadDefaultAvatar}/>
          <Content>
            <Title>
              {firstname} {lastname}
            </Title>
            <UsernameText>@{username}</UsernameText>
            {isMyProfile && (
              <Text>
                <EmailIcon />
                {email}
              </Text>
            )}
            <Text>
              <UpdateIcon />
              Hypertuber since {time}
            </Text>
            <Text>
              <LanguageIcon />
              {lang === "en" ? "English" : "Français"}
            </Text>
            {isMyProfile && (
              <ActionBtn>
                <EditForm />
                <EditResetForm />
                <Alert action={deleteAccount} />
              </ActionBtn>
            )}
          </Content>
        </UserInfos>
        {moviesWatching && moviesWatching.length > 0 ? (
          <Slider
            label={isMyProfile? `Continue Watching for ${username}` : `Watching in progress for ${username}`}
            moviesWatching={moviesWatching}
          />
        ) : (
          <SliderWrapper>
            <Label>{isMyProfile? `Continue Watching for ${username}` : `Watching in progress for ${username}`}</Label>
            <span
              style={{
                color: "white",
                width: "50%",
                textAlign: "center",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                marginTop: "50px"
              }}
            >
              No movies in progress yet. Explore Hypertube and discover new
              movies!
            </span>
          </SliderWrapper>
        )}
        {moviesWatched && moviesWatched.length > 0 ? (
          <Slider label={isMyProfile? "Watch It Again" : `Watched by ${username}`} moviesWatched={moviesWatched} />
        ) : (
          <SliderWrapper>
            <Label>{isMyProfile? "Watch It Again" : `Watched by ${username}`}</Label>
            <span
              style={{
                color: "white",
                width: "50%",
                textAlign: "center",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                marginTop: "50px"
              }}
            >
              No movies yet. Explore Hypertube and watch movies to create your
              Collection!
            </span>
          </SliderWrapper>
        )}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  myAccount: state.users.currentUser,
  user: state.users.currentProfile,
  isMyProfile: state.users.currentProfile.isMe,
  moviesDBInfo: state.moviePlayer.moviesDBInfo
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch),
    movies: bindActionCreators(allTheActions.moviePlayer, dispatch)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
