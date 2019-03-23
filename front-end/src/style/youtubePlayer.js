import styled from "styled-components";

export const VideoBackground = styled.div `
    box-sizing: border-box;
    background: #000;
    top: 0; right: 0; bottom: 50%; left: 0;
    z-index: -99;
    box-shadow: inset 20px 20px 40px 0px #000000;
    @media (max-width: 1024px) {
        display: block;
        width: 100%;
        height: 30vh;
        bottom: 0;
        position: relative;
        top: 0; right: 0; bottom: 0; left: 0;
    }
`
export const VideoForeground = styled.div `
    box-sizing: border-box;
    position: absolute;
    top: 100px;
    right: 0;
    min-width: 50%;
    min-height: 50%;
    pointer-events: none;
    &:after {
            content:"";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 99;
            box-shadow:  inset 50px 10px 50px 0px #000000;
            pointer-events: none;
            opacity: 0.9;
            filter: alpha(opacity=90);
            z-index: -1000;
    }
    @media (max-width: 1024px) {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        top: 0px;
    }
`
export const IframeYoutube = styled.iframe `
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
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
export const MobileVideoWrapper = styled.div `
    @media (max-width: 1024px) {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        padding-top: 25px;
        height: 0;
    }
    @media (max-width: 1025px) {
        display: none;
    }
`
export const IframeYoutubeMobile = styled.iframe `
    @media (max-width: 1024px) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    @media (min-width: 1025px) {
        display: none;
    }
`