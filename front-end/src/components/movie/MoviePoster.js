import React from "react";
import { Helmet } from "react-helmet";
import { PosterImage } from "../../style/moviePoster";

export default class MoviePoster extends React.Component {
  addDefaultSrc = ev => {
    ev.target.src =
      "https://media.wired.com/photos/5b7350e75fc74d47846ce4e4/master/pass/Popcorn-869302844.jpg";
  };
  render() {
    const { activePlayer, moviePoster } = this.props;
    return (
      !activePlayer && (
        <div>
          <Helmet>
            <style>{"body { background-color: #000 }"}</style>
          </Helmet>
          {moviePoster && (moviePoster.includes('http') || moviePoster.includes('https')) ? (
            <PosterImage onError={this.addDefaultSrc} src={moviePoster} />
          ) : (
            <PosterImage
              onError={this.addDefaultSrc}
              src={
                "https://media.wired.com/photos/5b7350e75fc74d47846ce4e4/master/pass/Popcorn-869302844.jpg"
              }
            />
          )}
        </div>
      )
    );
  }
}
