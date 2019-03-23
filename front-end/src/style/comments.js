import { Button } from "@material-ui/core";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const Wrapper = styled.div`
  width: 90%;
  margin-bottom: 20px;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const Title = styled.h1`
  color: white;
  @media (max-width: 767px) {
    font-size: 1.5em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
`;

export const CommentForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  @media (max-width: 767px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export const UserInfo = styled.div`
  margin-right: 20px;
  color: white;
  text-align: center;
  font-style: italic;
  font-size: 1rem;
  font-weight: 350;
  min-width: 5%;
  @media (max-width: 1024px) {
    width: 10%;
  }
  @media (max-width: 767px) {
    width: 20%;
  }
`;

export const UserAvatar = styled.img`
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 5px;
  border-radius: 50%;
  width: 75px;
  height: 75px;
  object-fit: cover;
`;

export const CommentInput = styled.textarea`
  margin-right: 20px;
  width: 75%;
  outline: none;
  height: 5rem;
  padding: 10px 10px;
  resize: none;
  color: grey;
  font-size: 1rem;
  font-weight: 450;
  @media (max-width: 767px) {
    width: 60%;
  }
`;

export const CommentButton = styled(Button)`
  width: 15%;
  margin-top: 1rem;
  height: 4rem;
  outline: none;
  background-color: #db1b28;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  border-radius: 0;
  display: flex;
  justify-content: space-around;
  padding: 5px 10px 5px 10px;
  &:hover {
    transform: scale(1) perspective(1px);
    background-color: #e50914;
    color: white;
  }
  @media (max-width: 767px) {
    width: 90%;
    height: 3rem;
    font-size: 1rem;
  }
`;

export const AllCommentsLink = styled.div`
  width: 100%;
  color: white;
  font-size: 0.8rem;
  color: #e50914;
  text-decoration: underline;
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
`;

export const AllCommentsWrapper = styled.div`
  width: 90%;
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 30px;
  @media (max-width: 1024px) {
    width: 100%;
  }
  @media (max-width: 767px) {
    margin-bottom: 0;
  }
`;

export const CommentContent = styled.div`
  width: 90%;
  margin-left: 10px;
  @media (max-width: 1024px) {
    max-width: 85%;
  }
  @media (max-width: 767px) {
    max-width: 70%;
  }
`;

export const CommentText = styled.p`
  color: white;
  margin: 0;
  word-break: break-all;
  @media (max-width: 767px) {
    font-size: 0.8em;
  }
`;

export const AuthorAvatar = styled.img`
  margin-right: auto;
  margin-left: auto;
  border-radius: 50%;
  width: 75px;
  height: 75px;
  object-fit: cover;
`;

export const AuthorName = styled.p`
  color: white;
  font-size: 1.17em;
  font-weight: bold;
  margin-bottom: 0.5em;
  @media (max-width: 767px) {
    font-size: 1em;
  }
`;

export const LinkToProfile = styled(Link)`
  text-decoration: none;
  color: white;
`;

export const LinkToProfileAvatar = styled(Link)`
  text-decoration: none;
  color: white;
  margin-right: auto;
  margin-left: auto;
`;

export const CommentDate = styled.span`
  color: grey;
  font-size: 0.8em;
  font-weight: 350;
  @media (max-width: 767px) {
    font-size: 0.7em;
  }
`;
