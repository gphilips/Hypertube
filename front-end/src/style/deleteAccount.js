import styled from "styled-components";
import { Button } from '@material-ui/core';

export const Btn = styled(Button)`
    background-color: none;
    color: ${props => props.theme.color.primary}
    font-weight: bold;
    border-radius: 0;
    margin-left: 10px;
    border: 1px solid ${props => props.theme.color.primary};
    &:hover {
        background-color: none;
    }
    @media (max-width: 630px) {
        display: block;
        width: 100%;
        margin-left: 0px;
        margin-bottom: 1em;
      }
`;