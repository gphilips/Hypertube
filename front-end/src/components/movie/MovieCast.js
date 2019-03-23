import React from "react";
import {
  Wrapper,
  CastWrapper,
  Title,
  Actor,
  Name,
  Surname,
  ActorAvatar
} from "../../style/movieCast";

export default class MovieCast extends React.Component {
  addDefaultSrc = ev => {
    ev.target.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Walk_of_Fame_Category_Motion_Pictures.jpg/220px-Walk_of_Fame_Category_Motion_Pictures.jpg";
  };
  render() {
    let actors = this.props.movieCast;
    let activePlayer = this.props.activePlayer;
    if (actors.length >= 10) {
      actors = actors.slice(0, 10);
    }
    return (
      !activePlayer && (
        <Wrapper>
          <Title>Starring</Title>
          <CastWrapper>
            {actors &&
              actors.map(actor => (
                <Actor key={actor.name + actor.character}>
                  {actor.profile_path ? (
                    <ActorAvatar
                      alt={actor.name}
                      onError={this.addDefaultSrc}
                      src={
                        "https://image.tmdb.org/t/p/original/" +
                        actor.profile_path
                      }
                    />
                  ) : (
                    <ActorAvatar
                      alt={actor.name}
                      onError={this.addDefaultSrc}
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Walk_of_Fame_Category_Motion_Pictures.jpg/220px-Walk_of_Fame_Category_Motion_Pictures.jpg"
                      }
                    />
                  )}
                  <Name>{actor.name}</Name>
                  <Surname>as {actor.character}</Surname>
                </Actor>
              ))}
          </CastWrapper>
        </Wrapper>
      )
    );
  }
}
