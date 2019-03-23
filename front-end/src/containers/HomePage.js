import React from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";

const Wrapper = styled.div``;
const Cover = styled.img``;

class HomePage extends React.Component {

  renderCover = () => {
    const { covers } = this.state;
    return covers.map(cover => (
      <Cover />
    ));
  }
  render() {
    return (
      <Wrapper>
        
      </Wrapper>
    );
  }
}

export default connect(
  null, 
  null,
)(HomePage);