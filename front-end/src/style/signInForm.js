import styled from "styled-components";
import { CardContent, Button } from '@material-ui/core';
import { Link } from "react-router-dom";

export const Content = styled(CardContent)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @media (max-width: 450px) {
    max-width: 90%;
  }
`;

export const SignInFormStyled = styled.form`
  @media (max-width: 450px) {
    width: 100%;
  }
`;

export const Title = styled.h1`
  font-size: ${props => props.theme.fontSize.h1};
  color: ${props => props.theme.color.text};
  display: flex;
  justify-content: flex-start;
  @media (max-width: 450px) {
   display: block;
   text-align: center;
   margin-bottom: 0;
   margin-top: 0;
   font-size: ${props => props.theme.fontSize.h1};
  }
`;

export const BtnForm = styled(Button)`
  color: ${props => props.theme.color.text};
  background-color: ${props => props.theme.color.primary};
  margin: 30px 0 15px;
  border-radius: 0;
  font-weight: bold;
  &:hover {
    background-color: ${props => props.theme.color.primary};
  }
  &:disabled {
    color: ${props => props.theme.color.text};
    background-color: ${props => props.theme.color.primary};
  }
  @media (max-width: 450px) {
    max-width: 100%;
    margin-top: 0;
  }
`;

export const LinkReset = styled(Link)`
  color: ${props => props.theme.color.darkText};
  display: flex;
  justify-content: center;
  text-decoration: none;
`;

export const SignUpDiv = styled.p`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.darkText};
  display: flex;
  justify-content: center;
`;

export const LinkSignUp = styled(Link)`
  color: ${props => props.theme.color.text};
  padding-left: 5px;
  font-weight: bold;
  text-decoration: none;
`;

export const SocialLogins = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 450px) {
		display: block;
		width: 100%;
	}
`;

export const Label = styled.p`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.color.darkText};
`;