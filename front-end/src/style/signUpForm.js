import styled from "styled-components";
import {
  CardContent,
  Button,
  IconButton,
} from '@material-ui/core';

export const Content = styled(CardContent)`
    display: flex;
    flex: 1;
    margin: 0 40px;
    flex-direction: column;
`;

export const Title = styled.h1`
  font-size: ${props => props.theme.fontSize.h1};
  color: ${props => props.theme.color.text};
  display: flex;
  justify-content: flex-start;
`;

export const Form = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-around;
`;

export const BtnForm = styled(Button)`
  color: ${props => props.theme.color.text};
  background-color: ${props => props.theme.color.primary};
  &:hover {
    background-color: ${props => props.theme.color.primary};
  }
  &:disabled {
    color: ${props => props.theme.color.text};
    background-color: ${props => props.theme.color.primary};
  }
`;

export const ArrowIcon = styled(IconButton)`
  color: ${props => props.theme.color.primary};
  background-color: ${props => props.theme.color.secondary};
  &:hover {
    background-color: ${props => props.theme.color.secondary};
  }
`;

export const ChangeStepBtn = styled.div`
  display: flex;
  justify-content: space-around;
`;