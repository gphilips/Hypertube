import styled from "styled-components";
import {
	Button,
	DialogActions,
	Divider,
} from "@material-ui/core";

export const Wrapper = styled.div`
	display: flex;
`;

export const Btn = styled(Button)`
    background-color: none;
    color: white;
    font-weight: bold;
    border-radius: 0;
    border: 1px solid ${props => props.theme.color.secondary};
    &:hover {
        border: 1px solid ${props => props.theme.color.primary};
        background-color: rgba(229, 9, 20, 0.3);
    }
    @media (max-width: 630px) {
        display: block;
        width: 100%;
        margin-bottom: 10px;
      }
`;

export const Separator = styled(Divider)`
	margin: 5vh 0;
`;

export const SubmitBtn = styled(DialogActions)`
	justify-content: space-around;
`;