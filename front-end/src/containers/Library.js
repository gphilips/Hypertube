import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  CardActionArea,
  CardContent,
  CardMedia,
  InputLabel,
  MenuItem
} from "@material-ui/core";
import StarRatingComponent from "react-star-rating-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import allTheActions from "../actions";
import {
  Wrapper,
  SearchOptions,
  LibraryContent,
  MovieElement,
  MovieCard,
  DetailsCard,
  FormStyle,
  SelectBlock,
  SelectGenre,
  SelectSort,
  Options,
  FieldName,
  SearchField,
  FormButton,
  DeleteButton,
  CustomButton,
  Loader,
  Typo,
  TitleTypo,
  MediumTypo,
  SmallTypo,
  GenreTypo,
  MovieSeen
} from "../style/libraryStyle";
import createNotification from "../utils/notificationForm";
import timeConvert from "../utils/timeConvert";
import { history } from "../config/store";
import {
  GENRE,
  INITIAL_SEARCH_FILTERS,
  INITIAL_SORT_FILTERS,
  INITIAL_STATE
} from "../constants/library";

let isFirefox = typeof InstallTrigger !== 'undefined';

class Library extends React.Component {
  _isMounted = false;
  state = {
    ...INITIAL_STATE,
    filters: { ...INITIAL_SORT_FILTERS, ...INITIAL_SEARCH_FILTERS },
    scroll: false
  };

  initializePage = () => {
    const { libraryLoading } = this.props.actions.library;
    libraryLoading(true);
    this.loadMovies();
  };

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      const { cleanLibrary } = this.props.actions.library;
      const { getUser } = this.props.actions.users;
      const token = localStorage.Authorization.split(" ")[1];
      await cleanLibrary();
      await getUser(token);
      this.changeFiltersValues();
      if (this._isMounted) {
        await this.setState({
          isLoading: false,
          genreProps: this.props.match.params.genre,
          userId: this.props.userId
        });
      }
      await this.loadMovies();

      this.timerHandle = setInterval( async function() {
        if (this.state.scroll && this._isMounted) {
          this.setState({ scroll: false})
          const { isLoading, hasMore } = this.state;
          if (isLoading || !hasMore || !this.props.loadingLibrary) {
            return;
          }
          if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
          ) {
            await this.loadMovies();
          }
        }
      }.bind(this), 30 );

      window.onscroll = async () => {
        if (!isFirefox) {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore || !this.props.loadingLibrary) {
          return;
        }
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          await this.loadMovies();
        }
      } else {
        if (this._isMounted) {
          this.setState({scroll: true})
        }
        
      }
    }
        } 
  }

  async componentDidUpdate(prevProps) {
    if (this._isMounted) {
      if (this.props.match.params.genre !== prevProps.match.params.genre) {
        this.changeFiltersValues();
        let filters = {
          ...this.state.filters,
          ...INITIAL_SEARCH_FILTERS,
          ...INITIAL_SORT_FILTERS
        };

        if (this._isMounted)
          await this.setState({
            filters,
            genreProps: this.props.match.params.genre,
            prevLength: 0,
            currentPage: 1
          });
        if (this._isMounted) await this.initializePage();
      }
    }
  }

  loadMovies = async () => {
    let { genreProps, currentPage, filters, isLoading, userId } = this.state;
    const { getSortedLibrary, cleanLibrary } = this.props.actions.library;
    if (!isLoading && this._isMounted) {
      await this.setState({ isLoading: true }, async () => {
        while (
          this.props.loadingLibrary === true &&
          (currentPage <= this.props.totalPage || currentPage === 1) &&
          (this.props.movies.length < this.state.prevLength + 50 ||
            this.props.movies.length === 0) &&
          this._isMounted
        ) {
          if (this.state.changeFiltersValues === true) {
            await cleanLibrary();
            currentPage = 1;
            filters = this.state.filters;
            genreProps = this.state.genreProps;
            if (this._isMounted) {
              await this.setState({ changeFiltersValues: false });
            }
            continue;
          }
          await getSortedLibrary(currentPage, filters, genreProps, userId);
          currentPage++;
        }
        if (this._isMounted) {
          await this.setState({
            hasMore: this.state.currentPage < this.props.totalPage + 1,
            isLoading: false,
            currentPage: currentPage,
            prevLength: this.props.movies.length
          });
        }
      });
    }
  };

  changeFiltersValues = () => {
    const { cleanLibrary } = this.props.actions.library;
    if (this.state.isLoading && this._isMounted) {
      this.setState({ changeFiltersValues: true });
    } else {
      cleanLibrary();
      if (this._isMounted) {
        this.setState({ hasMore: true });
      }
    }
  };

  removeFilters = async () => {
    let filters = {
      ...this.state.filters,
      ...INITIAL_SEARCH_FILTERS,
      ...INITIAL_SORT_FILTERS
    };
    if (this._isMounted) {
      await this.setState({ filters, currentPage: 1, prevLength: 0 });
    }
    await this.changeFiltersValues();
    await this.initializePage();
  };

  handleSubmit = async e => {
    e.preventDefault();
    let filters = { ...this.state.filters, searchByRYK: true };
    if (this._isMounted) {
      await this.setState({ filters, prevLength: 0, currentPage: 1 });
    }
    await this.changeFiltersValues();
    await this.initializePage();
  };

  handleChangeRating = e => {
    if (parseInt(e.min) >= 0 && parseInt(e.max) <= 10) {
      let ratingValue = { min: parseInt(e.min), max: parseInt(e.max) };
      let filters = { ...this.state.filters, ratingValue };
      if (this._isMounted) {
        this.setState({ filters });
      }
    }
  };

  handleChangeYear = e => {
    if (parseInt(e.min) >= 1915 && parseInt(e.max) <= 2019) {
      let yearValue = { min: parseInt(e.min), max: parseInt(e.max) };
      let filters = { ...this.state.filters, yearValue };
      if (this._isMounted) {
        this.setState({ filters });
      }
    }
  };

  handleChangeKeyword = e => {
    let validKeyword = e.target.value.match(/^[a-zA-Z0-9,?!. ]+$/);
    if ((validKeyword && e.target.value.length <= 50) || !e.target.value) {
      let filters = { ...this.state.filters, [e.target.name]: e.target.value };
      if (this._isMounted) {
        this.setState({ filters });
      }
    } else {
      createNotification("warning", "Invalid characters or too long request.");
    }
  };

  handleChange = async e => {
    await this.changeFiltersValues();
    let filters;
    if (!this.state.filters.searchByRYK) {
      filters = {
        ...this.state.filters,
        ...INITIAL_SEARCH_FILTERS,
        [e.target.name]: e.target.value
      };
      if (this._isMounted) {
        await this.setState({ filters });
      }
    }
    if (e.target.name === "genre") {
      filters = {
        ...this.state.filters,
        searchByGenre: true,
        [e.target.name]: e.target.value
      };
    } else {
      filters = { ...this.state.filters, [e.target.name]: e.target.value };
    }
    if (this._isMounted) {
      await this.setState({ filters, prevLength: 0, currentPage: 1 });
    }
    await this.initializePage();
  };

  formatGenre = value => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  componentWillUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
  } 
  this._isMounted = false;
  }

  addDefaultSrc = ev => {
    ev.target.src = "http://localhost:3000/images/defaultMovieBackground.jpg";
  };

  render() {
    const movieDB = this.props.movies;
    const { hasMore, isLoading, filters, genreProps } = this.state;
    return (
      <Wrapper>
        <SearchOptions>
          <Options>
            <FieldName htmlFor="rating">Rating</FieldName>
            <InputRange
              id="rating"
              maxValue={10}
              minValue={0}
              value={filters.ratingValue}
              onChange={this.handleChangeRating}
            />
            <FieldName htmlFor="year">Production year</FieldName>
            <InputRange
              id="year"
              maxValue={2019}
              minValue={1915}
              value={filters.yearValue}
              onChange={this.handleChangeYear}
            />
            <FieldName htmlFor="keyword">Search by title</FieldName>
            <SearchField
              id="keyword"
              type="text"
              name="keyword"
              placeholder="Movie Title"
              onChange={this.handleChangeKeyword}
              value={filters.keyword}
            />
            <FormButton onClick={this.handleSubmit} type="submit">
              Search
            </FormButton>
            <DeleteButton onClick={this.removeFilters}>
              Remove filters
            </DeleteButton>
          </Options>
          <SelectBlock>
            {genreProps === "popular" ? (
              <FormStyle style={{ width: "30%" }}>
                <InputLabel style={{ color: "white" }} htmlFor="genre">
                  Genres
                </InputLabel>
                <SelectGenre
                  inputProps={{
                    name: "genre",
                    id: "genre"
                  }}
                  value={filters.genre}
                  onChange={this.handleChange}
                  name="genre"
                >
                  {GENRE.map(value => (
                    <MenuItem name="genre" key={value} value={value}>
                      {this.formatGenre(value)}
                    </MenuItem>
                  ))}
                </SelectGenre>
              </FormStyle>
            ) : (
              ""
            )}
            <FormStyle style={{ width: "30%" }}>
              <InputLabel style={{ color: "white" }} htmlFor="sort">
                Sort by
              </InputLabel>
              <SelectSort
                inputProps={{
                  name: "sortBy",
                  id: "sort"
                }}
                value={filters.sortBy}
                onChange={this.handleChange}
                name="sortBy"
              >
                <MenuItem name="sortBy" value="rating">
                  Rating
                </MenuItem>
                <MenuItem name="sortBy" value="title">
                  Title
                </MenuItem>
                <MenuItem name="sortBy" value="year">
                  Year
                </MenuItem>
              </SelectSort>
            </FormStyle>
          </SelectBlock>
        </SearchOptions>
        {movieDB && movieDB.length > 0 ? (
          <div>
            <LibraryContent id="Movie-scrolling">
              {movieDB.map(movie => (
                <MovieElement key={movie.title + movie.id}>
                  {movie.movieSeen && (
                    <MovieSeen
                      src="http://localhost:3000/images/movieSeen.png"
                      alt="resume"
                    />
                  )}
                  <MovieCard>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        alt={movie.title + "poster"}
                        className="moviePic"
                        onError={this.addDefaultSrc}
                        image={
                          movie.large_cover_image
                            ? movie.large_cover_image
                            : "http://localhost:3000/images/defaultMovieBackground.jpg"
                        }
                        ref={this.myRef}
                      />
                      <CardContent>
                        <Typo gutterBottom component="h2">
                          {movie.title}
                        </Typo>
                        <StarRatingComponent
                          editing={false}
                          name={"rate" + movie.title}
                          starCount={5}
                          value={movie.rating / 2}
                        />
                      </CardContent>
                    </CardActionArea>
                  </MovieCard>
                  <DetailsCard className="details">
                    <CardContent style={{ display: "block" }}>
                      <TitleTypo>{movie.title}</TitleTypo>
                      <br />
                      <MediumTypo
                        style={{
                          display: "flex",
                          justifyContent: "space-around"
                        }}
                      >
                        <span>
                          {movie.rating}{" "}
                          <FontAwesomeIcon
                            style={{ color: "#F4AE33" }}
                            icon="star"
                          />
                        </span>
                        <span style={{ paddingLeft: "4em" }}>{movie.year}</span>
                        <span style={{ paddingLeft: "4em" }}>
                          {movie.runtime ? timeConvert(movie.runtime) : ""}
                        </span>
                      </MediumTypo>
                      <GenreTypo>
                        Genres:{" "}
                        {movie.genres && movie.genres.length > 0
                          ? movie.genres.join(", ")
                          : ""}
                      </GenreTypo>
                      <SmallTypo>
                        {movie.synopsis.split(" ").length > 70
                          ? movie.synopsis
                              .split(" ")
                              .splice(0, 70)
                              .join(" ") + "..."
                          : movie.synopsis}
                      </SmallTypo>
                    </CardContent>
                    <CustomButton
                      onClick={() => history.push(`/movie/${movie.movie_id}`)}
                    >
                      Watch it!
                    </CustomButton>
                  </DetailsCard>
                </MovieElement>
              ))}
            </LibraryContent>
            {isLoading && (
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <Loader />
              </div>
            )}
            {(!hasMore || !this.props.loadingLibrary) && (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  color: "white"
                }}
              >
                You did it! You reached the end!
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Loader />
          </div>
        ) : (
          <div
            style={{ textAlign: "center", marginTop: "50px", color: "white" }}
          >
            No results found.
          </div>
        )}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    movies: state.library.currentLibrary,
    totalPage: state.library.totalPage,
    loadingLibrary: state.library.loadingLibrary,
    userId: state.users.currentUser._id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      library: bindActionCreators(allTheActions.library, dispatch),
      users: bindActionCreators(allTheActions.users, dispatch)
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library);
