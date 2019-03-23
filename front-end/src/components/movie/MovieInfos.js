import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Wrapper,
  Title,
  Field,
  Description,
  Genre,
  ResButton
} from "../../style/movieInfo";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

export default class MovieInfos extends React.Component {
  constructor() {
    super();
    this.state = {
      movieRestriction: "",
      openPlayer: false
    };
  }

  changeRes = e => {
    if (e.target && e.target.innerHTML.includes("1080p")) {
      this.props.hideInfo("1080p");
    } else if (e.target && e.target.innerHTML.includes("720p")) {
      this.props.hideInfo("720p");
    } else {
      this.props.hideInfo("720p");
    }
  };

  movieRestriction = data => {
    if (data === "PG-13") {
      return "13+";
    } else if (data === "G" || data === "PG") {
      return "ALL AGES";
    } else if (data === "R") {
      return "16+";
    } else if (data === "NC-17") {
      return "18+";
    } else {
      return null;
    }
  };

  render() {
    const { movieData, activePlayer } = this.props;
    const movieRestriction = this.movieRestriction(movieData.movieRestriction);
    const highDefTorrentHash = this.props.highDefTorrentHash;
    const lowDefTorrentHash = this.props.lowDefTorrentHash;
    return (
      !activePlayer && (
        <Wrapper>
          <div>
            <Title>{movieData.movieTitle}</Title>
            {movieData.movieRating && (
              <Field>
                {movieData.movieRating}
                <FontAwesomeIcon style={{ color: "#F4AE33" }} icon="star" />
              </Field>
            )}
            {movieRestriction && movieRestriction.length > 0 && (
              <Field>
                <span
                  style={{
                    border: "1px solid white",
                    padding: "5px 10px 5px 10px"
                  }}
                >
                  {movieRestriction}
                </span>
              </Field>
            )}
            {movieData.movieYear && <Field>{movieData.movieYear}</Field>}
            {movieData.movieRuntime && <Field>{movieData.movieRuntime}</Field>}
            <br />
            {movieData.movieDescription && (
              <Description>{movieData.movieDescription}</Description>
            )}
            {lowDefTorrentHash && (
              <ResButton id="720p" value="720p" onClick={this.changeRes}>
                <PlayArrowIcon
                  style={{ fontSize: "large", verticalAlign: "middle" }}
                />
                <span>720p</span>
              </ResButton>
            )}
            {highDefTorrentHash &&
              lowDefTorrentHash &&
              highDefTorrentHash !== lowDefTorrentHash && (
                <ResButton id="1080p" value="1080p" onClick={this.changeRes}>
                  <PlayArrowIcon
                    style={{ fontSize: "large", verticalAlign: "middle" }}
                  />
                  <span>1080p</span>
                </ResButton>
              )}
            <br />
            {movieData.movieGenres && (
              <Genre>
                Genres:{" "}
                {movieData.movieGenres && movieData.movieGenres.join(", ")}
              </Genre>
            )}
          </div>
        </Wrapper>
      )
    );
  }
}
