import React from "react";
import queryString from 'query-string';
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faGoogle, faFacebook);

const SocialLogin = styled(Button)`
	display: flex;
	justify-content: center;
	flex-direction: column;
	margin-right: 2px;
	background-color: ${props => props.theme.color[props.provider || "primary"]};
	color: ${props => props.theme.color.text};
	font-weight: bold;
	border-radius: 0;
	&:hover {
		background-color: ${props => props.theme.color[props.provider || "primary"]};
	}
	@media (max-width: 450px) {
		display: block;
		width: 100%;
		margin-bottom: 10px;
		margin-right: 0px;
	}
`;
const Icon = styled(FontAwesomeIcon)`
	margin: 0 5px;
`;

export class OAuthButton extends React.Component {
	getIcon = provider => {
		switch (provider) {
			case "google":
				return ["fab", "google"];
			case "facebook":
				return ["fab", "facebook"];
			case "42":
				return faLaptop;
			default:
				return;
		}
	};

	openPopup = () => {
		const { logInWithOauth, provider } = this.props;
		
		const urlProvider = `http://localhost:5000/api/auth/${provider}`;
		const popup = window.open(urlProvider, "_blank", "height=500, width=500");
		const popupInterval = setInterval(() => { 
			try {
				if (!popup || popup.closed)
					clearInterval(popupInterval);
				if (popup.location.search) {
					const url = queryString.parse(popup.location.search);
					logInWithOauth(url);
					popup.close();
				}
			}
			catch(e) {}
	}, 100);
	};

	render() {
		const { provider } = this.props;
		return (
			<SocialLogin
				variant="contained"
				onClick={() => this.openPopup()}
				provider={provider}
			>
				<Icon icon={this.getIcon(provider)} size="lg" />
				{provider}
			</SocialLogin>
		)
	}
}

export default OAuthButton;
