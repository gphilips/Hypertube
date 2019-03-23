import styled from "styled-components";
import { Email, Update, Language } from "@material-ui/icons";

export const Wrapper = styled.div`
    margin-top: 5em;
    display: flex;
    width: 80%;
    margin-right: auto;
    margin-left: auto;
    flex-direction: column;
    @media (max-width: 630px) {
        width: 90%;
      }
`;

export const UserInfos = styled.div`
    display: flex;
    justify-content: center;
    @media (max-width: 630px) {
        display: block;
        width: 100%;
      }
    @media (min-width: 631px) {
        height: 20vh;
        margin-bottom: 4em;
    }
`;

export const Avatar = styled.img`
    margin-block-start: 0.67em;
    border: 2px solid ${props => props.theme.color.secondary};
    object-fit: cover;
    height: 100%;
    width: auto;
    @media (max-width: 630px) {
        display: block;
        width: 30%;
        height: auto;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 20px;
      }
`;

export const Content = styled.div`
    padding-left: 20px;
`;

export const Title = styled.h1`
    margin: 0;
    color: ${props => props.theme.color.text};
`;

export const Text = styled.p`
    margin-top: 0;
	color: ${props => props.theme.color.secondary};
    font-size: ${props => props.theme.fontSize.medium};
    vertical-align: middle;
`;

export const UsernameText = styled.p`
    margin-top: 0;
    font-style: italic;
    font-weight: bold;
	color: ${props => props.theme.color.primary};
	font-size: ${props => props.theme.fontSize.small};
`;

export const Placeholder = styled.span`
	color: ${props => props.theme.color.darkText};
`;

export const ActionBtn = styled.div`
	display: flex;
    flex-direction: row;
    @media (max-width: 630px) {
        display: block;
        width: 100%;
      }
`;

export const EmailIcon = styled(Email)`
    color: ${props => props.theme.color.secondary};
    font-size: 1.5em;
    padding-right: 10px;
    vertical-align: middle;
`;

export const UpdateIcon = styled(Update)`
    color: ${props => props.theme.color.secondary};
    font-size: 1.5em;
    padding-right: 10px;
    vertical-align: middle;
`;

export const LanguageIcon = styled(Language)`
    color: ${props => props.theme.color.secondary};
    font-size: 1.5em;
    padding-right: 10px;
    vertical-align: middle;
`;