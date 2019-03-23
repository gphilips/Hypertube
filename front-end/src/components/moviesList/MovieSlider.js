import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import allTheActions from "../../actions";
import { IconButton } from "@material-ui/core";
import {
  Wrapper,
  Label,
  Carousel,
  CarouselList,
  CarouselTile,
  Img,
  CarouselLabel,
  PlayIcon
} from "../../style/movieSlider";

export class MovieSlider extends React.Component {
  removeDuplicates = arr => {
    let unique_array = [];
    for (let i = 0; i < arr.length; i++) {
      if (
        arr
          .map(function(e) {
            return e.title;
          })
          .indexOf(arr[i].title) >= i
      ) {
        unique_array.push(arr[i]);
      }
    }
    return unique_array;
  };

  render() {
    const { label } = this.props;
    let moviesData = [];
    let moviesFinishedData = [];
    if (this.props.moviesWatching) {
      let moviesWatching = this.props.moviesWatching.reverse();
      moviesWatching.forEach((movieWatching, i) => {
        if (movieWatching.movie.posterPath && movieWatching.movie.apiMovieId && movieWatching.movie.movieTitle) {
                  let tmp = {
          img: movieWatching.movie.posterPath
            ? movieWatching.movie.posterPath
            : "https://via.placeholder.com/150",
          title: movieWatching.movie.movieTitle
            ? movieWatching.movie.movieTitle
            : `Movie ${i + 1}`,
          movieUrl: "/movie/" + movieWatching.movie.apiMovieId
        };
        moviesData.push(tmp);
        }
      });
      moviesData = this.removeDuplicates(moviesData);
    }
    if (this.props.moviesWatched) {
      let moviesWatched = this.props.moviesWatched.reverse();
      moviesWatched.forEach((movieWatched, i) => {
        if (movieWatched.movie.posterPath && movieWatched.movie.apiMovieId && movieWatched.movie.movieTitle) {
        let tmp = {
          img: movieWatched.movie.posterPath
            ? movieWatched.movie.posterPath
            : "https://via.placeholder.com/150",
          title: movieWatched.movie.movieTitle
            ? movieWatched.movie.movieTitle
            : `Movie ${i + 1}`,
          movieUrl: "/movie/" + movieWatched.movie.apiMovieId
        };
        moviesFinishedData.push(tmp);
      }
      });
      moviesFinishedData = this.removeDuplicates(moviesFinishedData);
    }
    return (
      <Wrapper>
        <Label>{label}</Label>
        {moviesData && moviesData.length > 0 && (
          <Carousel>
            <CarouselList cols={4}>
              {moviesData.map(movie => (
                <CarouselTile key={movie.title}>
                  <Img
                    src={movie.img}
                    alt={movie.title}
                    style={{ objectFit: "cover" }}
                  />
                  <CarouselLabel
                    title={movie.title}
                    actionIcon={
                      <Link to={movie.movieUrl}>
                      <IconButton>
                        
                          <PlayIcon fontSize="large" />{" "}
                        
                      </IconButton></Link>
                    }
                  />
                </CarouselTile>
              ))}
            </CarouselList>
          </Carousel>
        )}
        {moviesFinishedData && (
          <Carousel>
            <CarouselList cols={4}>
              {moviesFinishedData.map(movie => (
                <CarouselTile key={movie.title}>
                  <Img
                    src={movie.img}
                    alt={movie.title}
                    style={{ objectFit: "cover" }}
                  />
                  <CarouselLabel
                    title={movie.title}
                    actionIcon={
                      <IconButton>
                        <Link to={movie.movieUrl}>
                          <PlayIcon fontSize="large" />
                        </Link>
                      </IconButton>
                    }
                  />
                </CarouselTile>
              ))}
            </CarouselList>
          </Carousel>
        )}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.users.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      users: bindActionCreators(allTheActions.users, dispatch)
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MovieSlider);
