import React from 'react';
import styled from "styled-components";

import Background from "../../img/background.jpg";
import logo from "../../img/logo.png";

const Wrapper = styled.div`
  background-image: linear-gradient(
    rgba(0, 0, 0, 0.50), 
    rgba(0, 0, 0, 0.50)
  ),
  url(${Background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  top:0;
  bottom:0;
  left:0;
  right:0;
  position: absolute;
`;

const Logo = styled.img`
  margin: ${props => props.margin ? "2vh 2vw" : "0"};
  width: ${props => props.width || 10}vw;
  min-width: 70px;
`;

class GuestWrapper extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <Wrapper>
        <nav>
          <Logo src={logo} alt={"logo"} width={20} margin />
        </nav>
        { children }
      </Wrapper>
    );
  }
}

export default GuestWrapper;