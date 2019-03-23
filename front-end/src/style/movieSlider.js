import {
    GridList,
    GridListTile,
    GridListTileBar,
  } from '@material-ui/core';
import { PlayCircleOutline } from '@material-ui/icons';
import styled from "styled-components";

export const Wrapper = styled.div`
  margin: 2em;
  overflow: hidden;
  @media (max-width: 630px) {
    display: block;
    width: 100%;
    margin-top: 0;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1em;
  }
`;

export const Label = styled.p`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.text};
  font-weight: bold;
`;

export const Carousel = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  overflow: hidden;
`;

export const CarouselList = styled(GridList)`
  flex-wrap: nowrap;
  transform: translate-z(0);
  overflow-y: hidden;
`;

export const CarouselTile = styled(GridListTile)`
  @media (max-width: 630px) {
    width: 50% !important;
  }
`;

export const PlayIcon = styled(PlayCircleOutline)`
  color: ${props => props.theme.color.primary};
`;

export const Img = styled.img`
  height: 100%;
  width: 100%;
`;

export const CarouselLabel = styled(GridListTileBar)`
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%);
  color: ${props => props.theme.color.text};
`;