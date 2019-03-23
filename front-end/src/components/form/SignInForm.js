import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Field, reduxForm, getFormValues, isInvalid } from "redux-form";
import {
	Content,
	SignInFormStyled,
	Title,
	BtnForm,
	LinkReset,
	SignUpDiv,
	LinkSignUp,
	SocialLogins,
	Label,
} from "../../style/signInForm";
import allTheActions from "../../actions";
import InputText from "../form/InputText";
import OAuthButton from "../form/OAuthButton";

const validateSignInForm = values => {
	const { username, password } = values;
	const errors = {};

	if (username && username.length < 4)
		errors.username = "Username is too short (4 characters minimum)";
	if (username && username.length > 30)
		errors.username = "Username is too long (30 characters maximum)";
	if (
		username &&
		!/^(?!.*--.*)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9._-]+$/i.test(username.trim())
	)
		errors.username = "Invalid username";
	if (password && password.length < 8)
		errors.password = "Password is too short (8 characters minimum)";
	if (password && password.length > 30)
		errors.password = "Password is too long (30 characters maximum)";
	return errors;
};

class SignInForm extends React.Component {
	handleSubmit = e => {
		const { username, password } = this.props.formValues;
		const { logInUser } = this.props.actions.users;
		e.preventDefault();
		logInUser({ username, password });
	};

	renderFields = () => {
		const { submitting, pristine, invalid } = this.props;
		return (
			<SignInFormStyled onSubmit={this.handleSubmit}>
				<Field name="username" label="Username" component={InputText} />
				<Field
					name="password"
					type="password"
					label="Password"
					component={InputText}
				/>
				<BtnForm
					type="submit"
					variant="contained"
					color="secondary"
					size="large"
					disabled={pristine || invalid || submitting}
					fullWidth
				>
					Sign in
				</BtnForm>
			</SignInFormStyled>
		);
	};

	renderSocialLogins = () => {
		const { logInWithOauth } = this.props.actions.users;
		return (
			<SocialLogins>
				<OAuthButton provider="42" logInWithOauth={logInWithOauth} />
				<OAuthButton provider="google" logInWithOauth={logInWithOauth} />
				<OAuthButton provider="facebook" logInWithOauth={logInWithOauth} />
			</SocialLogins>
		);
	};

	render() {
		return (
			<Content>
				<Title>Sign In</Title>
				{this.renderFields()}
				<LinkReset to="/forgot">Need help?</LinkReset>
				<Label>Sign in with:</Label>
				{this.renderSocialLogins()}
				<SignUpDiv>
					New to Hypertube?
					<LinkSignUp to="/sign-up">Sign up now</LinkSignUp>.
				</SignUpDiv>
			</Content>
		);
	}
}

SignInForm = reduxForm({
	form: "signInForm",
	validate: validateSignInForm,
})(SignInForm);

const mapStateToProps = state => ({
	formValues: getFormValues("signInForm")(state),
	invalid: isInvalid("signInForm")(state),
});

const mapDispatchToProps = dispatch => ({
	actions: {
		users: bindActionCreators(allTheActions.users, dispatch),
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignInForm);
