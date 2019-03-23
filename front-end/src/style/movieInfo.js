import styled from "styled-components";
import { Button } from "@material-ui/core";

export const Wrapper = styled.div`
  box-sizing: border-box;
  width: 45%;
  overflow: hidden;
  @media (max-width: 1024px) {
    display: block;
    width: 100%;
  }
  @media (min-width: 1025px) {
    min-height: 50vh;
  }
`;
export const Title = styled.h1`
  color: white;
  @media (max-width: 767px) {
    font-size: 1.5em;
    margin-block-start: 0em;
    margin-block-end: 0.1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
`;
export const Field = styled.p`
  color: white;
  width: 25%;
  float: left;
  display: inline;
  font-weight: bold;
  @media (max-width: 767px) {
    font-size: 1em;
    font-weight: bold;
  }
`;
export const Description = styled.p`
  margin-top: 50px;
  color: grey;
  text-align: justify;
  text-justify: inter-word;
  font-size: 1.2rem;
  font-weight: 450;
  line-height: 1.5;
  display: block;
  @media (max-width: 1024px) {
    margin-right: 10px;
  }
  @media (max-width: 767px) {
    margin-block-start: 3rem;
    font-size: 1rem;
    font-weight: 420;
    line-height: 1.5;
  }
`;
export const Genre = styled.p`
  color: grey;
  text-align: justify;
  text-justify: inter-word;
  font-size: 1.2rem;
  font-weight: 450;
  line-height: 1.5;
  @media (max-width: 767px) {
    margin-block-start: 0.1em;
    font-size: 1rem;
    font-weight: 420;
    line-height: 1.5;
  }
`;

export const ResButton = styled(Button)`
  background-color: #db1b28;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  border-radius: 0;
  display: inline-block;
  padding: 5px 10px 5px 10px;
  margin-right: 10px;
  &:hover {
    transform: scale(1) perspective(1px);
    background-color: #e50914;
    color: white;
  }
  @media (max-width: 767px) {
    font-size: 1rem;
    &:hover {
      transform: scale(1) perspective(1px);
    }
  }
`;
