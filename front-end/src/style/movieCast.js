import styled from "styled-components";

export const Wrapper = styled.div`
  width: 90%;
  @media (max-width: 1024px) {
    display: block;
    width: 100%;
  }
`;
export const CastWrapper = styled.div`
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  width: 100%;
  overflow-x: auto;
`;
export const Title = styled.h1`
  color: white;
  @media (max-width: 767px) {
    font-size: 1.5em;
    margin-block-end: 0.1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
`;
export const Actor = styled.div`
  text-align: center;
  margin-right: 15px;
`;
export const Name = styled.p`
  color: grey;
  font-size: 1.2rem;
  font-weight: 450;
  @media (max-width: 767px) {
    font-size: 1rem;
    font-weight: 420;
  }
`;
export const Surname = styled.p`
  color: grey;
  font-size: 1rem;
  font-style: italic;
  font-weight: 350;
  @media (max-width: 767px) {
    font-size: 0.8rem;
  }
`;
export const ActorAvatar = styled.img`
  margin-left: auto;
  margin-right: auto;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
`;
