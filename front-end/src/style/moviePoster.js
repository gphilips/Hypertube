import styled from "styled-components";

export const PosterImage = styled.img `
    position: absolute;
    top: 100px;
    right: 0;
    width: 48%;
    height: 50%;
    object-fit: cover;
    object-position: 100% 0;
    pointer-events: none;
    z-index: -1001;
    @media (max-width: 1024px) {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        top: 0px;
    }
`