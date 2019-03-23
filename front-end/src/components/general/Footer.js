import React from 'react';
import styled from "styled-components";

const Wrap = styled.footer`
	display: flex;
	align-items: center;
  	flex-direction: row;
  	justify-content: space-around;
  	background-color: ${props => props.theme.color.bgDarkOpacity};
	height: 10vh;
	max-width: 100%;
`;
const Text = styled.p`
  color: ${props => props.theme.color.darkText};
  font-size: ${props => props.theme.fontSize.small};
  text-align: center;
`;

export class Footer extends React.Component {
  render() {
    const year = new Date().getFullYear();	
		return (
			<Wrap>
				<div>
					<Text>
						Copyright © {year} Hypertube
						by Cnairi, Dcirlig and Gphilips
					</Text>
				</div>
			</Wrap>
		)
  }
}

export default Footer;
