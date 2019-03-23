import React from "react";
import {
  Wrapper,
  BrowserInfoWrapper,
  PlayerWrapper,
  BrowserArrow,
  BrowserInfo,
  MoviePlayerStyled,
  Loader
} from "../../style/moviePlayer";
import {
  ControlBar,
  BigPlayButton,
  ReplayControl,
  ForwardControl
} from "video-react";
import createNotification from "../../utils/notificationForm";
import "video-react/dist/video-react.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import allTheActions from "../../actions";
import { Helmet } from "react-helmet";
import SubtitlesButton from "./subtitlesButton";

let isFirefox = typeof InstallTrigger !== 'undefined';

class MoviePlayer extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      player: undefined,
      init: 1,
      error: "",
      moviePlaying: false,
      UrlSubtitlesEn: "",
      UrlSubtitlesFr: "",
      loading: true,
      isDefaultEn: false,
      isDefaultFr: false
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    let isDefaultEn = false;
    let isDefaultFr = false;
    const token = localStorage.Authorization.split(" ")[1];
    const { getUser } = this.props.actions.users;
    const { getSubtitles, getDefaultLanguage } = this.props.actions.library;
    await getUser(token);
    const { imdbMovieId, userId } = this.props;
    await getDefaultLanguage(userId);
    if (this.props.defaultLanguage === "en") {
      isDefaultEn = true;
    } else {
      isDefaultFr = true;
    }
    await getSubtitles(imdbMovieId, "en");
    await getSubtitles(imdbMovieId, "fr");
    const URL = window.URL || window.webkitURL;
    if (this.props.subtitlesEnBase64) {
      let subtitlesEnBase64 = window.atob(this.props.subtitlesEnBase64);
      const subtitlesEnBase64Blob = new Blob([subtitlesEnBase64], {
        type: "text/vtt"
      });
      const UrlSubtitlesEn = URL.createObjectURL(subtitlesEnBase64Blob);
      if (this._isMounted) {
         await this.setState({ UrlSubtitlesEn, isDefaultFr, isDefaultEn });
      }
    }
    if (this.props.subtitlesFrBase64) {
      let subtitlesFrBase64 = window.atob(this.props.subtitlesFrBase64);
      let subtitlesFrBase64Blob = new Blob([subtitlesFrBase64], {
        type: "text/vtt"
      });
      let UrlSubtitlesFr = URL.createObjectURL(subtitlesFrBase64Blob);
      if (this._isMounted) {
        await this.setState({ UrlSubtitlesFr, isDefaultFr, isDefaultEn });
      }  
    }
  }

  setPlayerRef = async player => {
    if (player && this._isMounted) {
      const { getTimestamps } = this.props.actions.moviePlayer;
      this.player = player;
      this.player.subscribeToStateChange(this.handleStateChange.bind(this));
      await getTimestamps(this.props.torrentHash, this.props.userId);
      if (this._isMounted) {
        this.setState({
          currentTime: Math.round(this.props.moviesStarted.currentTime),
          isFinished: this.props.moviesStarted.isFinished
        }); 
      }
    }
  };

  handleStateChange = async (state, prevState) => {
    let loading = true;
    if (this._isMounted && !this.state.error && !this.state.moviePlaying) {
      this.timer = setTimeout(
        function() {
          if (isNaN(this.state.player.duration)) {
            if (this._isMounted && !this.state.error) {
              this.setState({
                movieSrc: "http://media.w3.org/2010/05/video/movie_300.mp4",
                error: "timeOut try later !"
              });
              this.player.load();
              createNotification(
                "error",
                "Not enough seeders or bad connection! Try again later!"
              );
            }
          } else if (this._isMounted) {
            this.setState({ moviePlaying: true });
          }
        }.bind(this),
        90000
      );
    }
    if (state.error && this._isMounted) {
      this.setState({
        movieSrc: "http://media.w3.org/2010/05/video/movie_300.mp4",
        error: "timeOut try later !"
      });
      this.player.load();
      createNotification(
        "error",
        "Not enough seeders or bad connection! Try again later!"
      );
    }
    if (state !== prevState && this._isMounted) {
      if (state.duration) {
        loading = false;
      }
      await this.setState({
        player: state,
        loading
      });
    }
  };

  errorLoading = async ev => {
    if (this._isMounted) {
      this.setState({
        movieSrc: "http://media.w3.org/2010/05/video/movie_300.mp4"
      });
      this.player.load();
      createNotification(
        "error",
        "Something went wrong while loading your film. Not enough seeders or bad connection"
      );
    }
  };


  showButtonInfo = () => {
    document.getElementById("browserInfo").style.display = "inline";
  };

  hideButtonInfo = () => {
    document.getElementById("browserInfo").style.display = "none";
  };

  backToMovie = () => {
    if (this.props.activePlayer) {
      const {
        updateMovieList,
        deleteTimestamps
      } = this.props.actions.moviePlayer;
      const player = this.state.player;
      const {
        torrentHash,
        userId,
        moviePoster,
        movieTitle,
        apiMovieId
      } = this.props;
      if (this._isMounted) {
        this.setState({
          currentTime: Math.round(this.state.player.currentTime),
          isFinished: false,
          loading: true
        });
      }
      deleteTimestamps();
      updateMovieList(
        torrentHash,
        player,
        userId,
        moviePoster,
        movieTitle,
        apiMovieId
      );
    }
    this.props.showInfo();
  };

  componentWillUnmount() {
    this._isMounted = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.props.activePlayer) {
      const {
        updateMovieList,
        deleteTimestamps
      } = this.props.actions.moviePlayer;
      const player = this.state.player;
      const {
        torrentHash,
        userId,
        moviePoster,
        movieTitle,
        apiMovieId
      } = this.props;
      updateMovieList(
        torrentHash,
        player,
        userId,
        moviePoster,
        movieTitle,
        apiMovieId
      );
      deleteTimestamps();
    }
  }

  render() {
    let {
      movieSrc,
      activePlayer,
      moviePoster,
      imdbMovieId,
      subtitlesEn,
      subtitlesFr
    } = this.props;
    let {
      currentTime,
      isFinished,
      UrlSubtitlesEn,
      UrlSubtitlesFr,
      loading,
      isDefaultEn,
      isDefaultFr
    } = this.state;
    if (this.state.movieSrc) {
      movieSrc = this.state.movieSrc;
    }
    return (
      activePlayer &&
      movieSrc && (
        <Wrapper>
          <Helmet>
            <style>{"body { background-color: #000 }"}</style>
          </Helmet>
          <BrowserInfoWrapper>
            <BrowserArrow
              onClick={this.backToMovie}
              onMouseOver={this.showButtonInfo}
              onMouseOut={this.hideButtonInfo}
            />

            <BrowserInfo id="browserInfo">Back to Movie</BrowserInfo>
          </BrowserInfoWrapper>
          <PlayerWrapper>
          {loading && <Loader />}
            <MoviePlayerStyled
              onError={this.errorLoading}
              autoPlay
              id="movieplayer"
              poster={moviePoster}
              ref={this.setPlayerRef}
              fluid={false}
              startTime={!currentTime || isFinished ? 0 : currentTime}
              width="100%"
              height="100%"
            >
              {subtitlesEn && imdbMovieId && (
                <track
                  id="englishTrack"
                  label="English"
                  kind="captions"
                  srcLang="en"
                  src={UrlSubtitlesEn}
                  default={isDefaultEn}
                />
              )}
              {subtitlesFr && imdbMovieId && (
                <track
                  id="frenchTrack"
                  label="Francais"
                  kind="captions"
                  srcLang="fr"
                  src={UrlSubtitlesFr}
                  default={isDefaultFr}
                />
              )}
              <source id="moviePlayer" src={movieSrc} />
              <BigPlayButton position="center" />
              <ControlBar autoHide={true} disableDefaultControls={isFirefox}>
                {!isFirefox && <ReplayControl seconds={10} order={2.2} />}
                {!isFirefox && <ForwardControl seconds={10} order={3.2} />}
                {(subtitlesEn || subtitlesFr) && <SubtitlesButton order={7} />}
              </ControlBar>
            </MoviePlayerStyled>
          </PlayerWrapper>
        </Wrapper>
      )
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.users.currentUser._id,
    moviesStarted: state.moviePlayer.moviesStarted,
    subtitlesFr: state.library.subtitlesFr,
    subtitlesEn: state.library.subtitlesEn,
    subtitlesFrBase64: state.library.subtitlesFrBase64,
    subtitlesEnBase64: state.library.subtitlesEnBase64,
    defaultLanguage: state.library.defaultLanguage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      moviePlayer: bindActionCreators(allTheActions.moviePlayer, dispatch),
      users: bindActionCreators(allTheActions.users, dispatch),
      library: bindActionCreators(allTheActions.library, dispatch)
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoviePlayer);
