import React from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Card } from '@material-ui/core';

import Footer from "./Footer";
import Background from "../../img/background.jpg";
import BgReset from "../../img/bgReset.jpg";
import logo from "../../img/logo.png";

const Wrapper = styled.div`
  height: 100vh;
  max-width: 100%;
`;
const ContentWrapper = styled.div`
  background-image: linear-gradient(
    rgba(0, 0, 0, 0.50), 
    rgba(0, 0, 0, 0.50)
  ),
  url(${props => props.bg === "reset" ? BgReset : Background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 90vh;
  max-width: 100%;
  @media (max-width: 370px) {
    height: 100vh;
  }
  @media (max-width: 321px) {
    height: 120vh;
  }
`;
const Nav = styled.nav`
    margin-bottom: 10vh;
    @media (max-width: 450px) {
      margin-bottom: 0vh;
    }
`;
const Logo = styled.img`
  margin: ${props => props.margin ? "2vh 2vw" : "0"};
  width: ${props => props.width || 10}vw;
  min-width: 70px;
`;
const CardWrapper = styled(Card)`
  display: flex;
  min-height: 460px;
  background-color: ${props => props.theme.color[props.cardcolor || "bgDarkOpacity"]};
  @media (max-width: 450px) {
    max-width: 90%;
  }
`;
const Content = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

class GuestWrapper extends React.Component {
  render() {
    const { children, bg, cardColor } = this.props;
    return (
      <Wrapper>
         <ContentWrapper bg={bg}>
        <Nav>
          <Link to="/">
            <Logo src={logo} alt="logo" width={20} margin />
          </Link>
        </Nav>
        <Content>
          <CardWrapper cardcolor={cardColor}>
            { children }
          </CardWrapper>
        </Content>
      </ContentWrapper>
      <Footer />
      </Wrapper>
    );
  }
}

export default GuestWrapper;