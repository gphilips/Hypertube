import styled from "styled-components";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import {CircularProgress} from "@material-ui/core";

export const Wrapper = styled.div`
  width: 70%;
  height: 80vh;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 1024px) {
    display: block;
    width: 100%;
  }
`;

export const Loader = styled(CircularProgress)`
  color: #e50914;
  z-index: 1000;
  position:fixed;
  top: 54%;
  left: 49%;
  width: 60px;
`;

export const BrowserInfoWrapper = styled.div`
  margin-bottom: 20px;
`;

export const BrowserArrow = styled(ArrowBackIcon)`
  font-size: 50px;
  color: white;
  cursor: pointer;
  display: inline;
  vertical-align: middle;
`;

export const BrowserInfo = styled.span`
  font-size: 25px;
  font-weight: 500;
  display: none;
  vertical-align: middle;
  color: white;
  margin-left: 20px;
`;

export const PlayerWrapper = styled.div`
  height: 100%;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

export const MoviePlayerStyled = styled(Player)`
  outline: none !important;
  width: 100%;
  height: 100%;
`;
