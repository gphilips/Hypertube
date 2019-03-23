import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import createNotification from "../../utils/notificationForm";
import allTheActions from "../../actions";
import {
  Wrapper,
  Title,
  AllCommentsWrapper,
  CommentForm,
  AllCommentsLink,
  UserInfo,
  UserAvatar,
  AuthorAvatar,
  CommentInput,
  CommentButton,
  CommentContent,
  CommentText,
  AuthorName,
  LinkToProfile,
  LinkToProfileAvatar,
  CommentDate
} from "../../style/comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../img/avatar.jpg";
import randomString from "random-string";

library.add(faTrash);

class Comments extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      comment: "",
      display: false,
      comments: [],
      formWarning: null
    };
  }

  removeItem = async e => {
    const { removeComment } = this.props.actions.comments;
    const movieId = this.props.imdbMovieId;
    let commentArray = [];
    await removeComment(e._id);
    if (this.props.comments && this.props.comments.length > 0) {
      this.props.comments.forEach(comment => {
        if (comment.movieId === movieId) {
          commentArray = commentArray.concat(comment);
        }
      });
    }
    let reverseArray = commentArray.reverse();
    if (this._isMounted) {
      this.setState({ comments: reverseArray });
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    const {
      addNewComment,
      clearComments,
      getAllComments
    } = this.props.actions.comments;
    const userId = this.props.user._id;
    const movieId = this.props.imdbMovieId;
    const comment = this.state.comment;
    let commentArray = [];
    if (this.checkContent(comment)) {
      await addNewComment(userId, movieId, comment);
      await clearComments();
      await getAllComments(movieId);
      if (this.props.comments && this.props.comments.length > 0) {
        this.props.comments.forEach(comment => {
          if (comment.movieId === movieId) {
            commentArray = commentArray.concat(comment);
          }
        });
      }
      let reverseArray = commentArray.reverse();
      if (this._isMounted) {
        this.setState({ comments: reverseArray, comment: "" });
      }
    }
  };

  checkContent = comment => {
    let validComment = comment.match(/^[a-zA-Z0-9,?!. ]+$/);
    if (!validComment || comment.length > 140) {
      return 0;
    }
    return 1;
  };

  handlePress = e => {
    if (e.key === "Enter") {
      if (this._isMounted) {
        this.setState({
          formWarning:
            "You have to click on the submit button to post your comment."
        });
      }
    }
  };

  handleChange = e => {
    let content = e.target.value;
    let validComment = "";
    if (this._isMounted) {
      if (content) {
        validComment = this.checkContent(content);
        if (validComment) {
          if (this._isMounted) {
            this.setState({ comment: content });
          }
        } else {
          if (!this.state.formWarning) {
            createNotification(
              "error",
              "Invalid character or content exceeding 140 characters."
            );
          } else {
            createNotification("warning", this.state.formWarning);
            if (this._isMounted) {
              this.setState({ formWarning: null });
            }
          }
        }
      } else {
        if (this._isMounted) {
          this.setState({ comment: "" });
        }
      }
    }
  };

  displayComment = async () => {
    if (this._isMounted) {
      await this.setState({ display: !this.state.display });
    }
  };

  componentDidMount = async () => {
    this._isMounted = true;
    const { getAllComments, clearComments } = this.props.actions.comments;
    const movieId = this.props.imdbMovieId;
    let commentArray = [];
    await clearComments();
    await getAllComments(movieId);
    if (this.props.comments && this.props.comments.length > 0) {
      this.props.comments.forEach(comment => {
        if (comment.movieId === movieId) {
          commentArray = commentArray.concat(comment);
        }
      });
    }
    let reverseArray = commentArray.reverse();
    if (this._isMounted) {
      await this.setState({ comments: reverseArray });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { user } = this.props;
    const { comment, display, comments } = this.state;
    let activePlayer = this.props.activePlayer;
    return (
      !activePlayer && (
        <Wrapper>
          <Title>Comments</Title>
          <CommentForm onSubmit={this.handleSubmit}>
            <UserInfo>
              <UserAvatar src={user.avatar || defaultAvatar} />
              <br />@{user.username}
            </UserInfo>
            <CommentInput
              placeholder={"Say something about this movie here!"}
              value={comment}
              onKeyPress={this.handlePress}
              onChange={this.handleChange}
              type="text"
              name="name"
            />
            <CommentButton disabled={!comment} type="submit" value="Submit">
              SUBMIT
            </CommentButton>
          </CommentForm>
          <AllCommentsLink onClick={this.displayComment}>
            {display ? "Hide comments" : "View all comments"}
          </AllCommentsLink>
          {display === true ? (
            comments && comments.length > 0 ? (
              comments.map(comment => (
                <AllCommentsWrapper
                  key={
                    comment._id
                      ? comment._id
                      : comment.timestamp + randomString({ length: 20 })
                  }
                >
                  <LinkToProfileAvatar
                    to={`/profiles/${comment.author[0].username}`}
                  >
                    <AuthorAvatar src={comment.author[0].avatar} />
                  </LinkToProfileAvatar>
                  <CommentContent>
                    <AuthorName>
                      <LinkToProfile
                        to={`/profiles/${comment.author[0].username}`}
                      >
                        {comment.author[0].username.charAt(0).toUpperCase() +
                          comment.author[0].username.slice(1)}
                      </LinkToProfile>
                      <br />
                      <CommentDate>
                        {comment.timestamp}{" "}
                        {comment.author[0].username === user.username && (
                          <FontAwesomeIcon
                            onClick={() => {
                              this.removeItem(comment);
                            }}
                            style={{
                              color: "#e50914",
                              marginLeft: "10px",
                              cursor: "pointer"
                            }}
                            icon="trash"
                          />
                        )}
                      </CommentDate>
                    </AuthorName>
                    <CommentText>
                      {comment.commentContent.charAt(0).toUpperCase() +
                        comment.commentContent.slice(1)}
                    </CommentText>
                  </CommentContent>
                </AllCommentsWrapper>
              ))
            ) : (
              <div
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: "20px"
                }}
              >
                No comments found for this movie.
              </div>
            )
          ) : (
            ""
          )}
        </Wrapper>
      )
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.users.currentUser,
    comments: state.comments.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      comments: bindActionCreators(allTheActions.comments, dispatch)
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments);
