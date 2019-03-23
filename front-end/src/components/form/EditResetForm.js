import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Field, reduxForm, getFormValues, isInvalid } from "redux-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import { Wrapper, Btn, Separator, SubmitBtn } from "../../style/editResetForm";
import allTheActions from "../../actions";
import InputText from "./InputText";

const validateEditResetForm = values => {
  const { password, passwordCfm } = values;
  const errors = {};

  if (password && password.length < 8)
    errors.password = "Password is too short (8 characters minimum)";
  if (password && password.length > 30)
    errors.password = "Password is too long (30 characters maximum)";
  if (password && !/(?=.*[0-9])/.test(password))
    errors.password = "It must contain a numeric character";
  if (password && !/(?=.*[!@#$%^&*_-])/.test(password))
    errors.password = "It must contain a special character";
  if (password && !/(?=.*[A-Z])/.test(password))
    errors.password = "It must contain an uppercase character";
  if (password && !/(?=.*[a-z])/.test(password))
    errors.password = "It must contain a lowercase character";
  if (password !== passwordCfm)
    errors.passwordCfm = "Passwords are not the same";
  return errors;
};

export class EditResetForm extends React.Component {
  _isMounted = false;
  state = {
    open: false
  };

  componentDidMount() {
    this._isMounted = true;
  }

  handleOpen = () => {
    if (this._isMounted) {
      this.setState({ open: true });
    }
  };

  handleClose = () => {
    if (this._isMounted) {
      this.setState({ open: false });
    }
  };

  handleSubmit = e => {
    const { password, passwordCfm } = this.props.formValues;
    const {
      username,
      actions: {
        users: { resetPassword }
      }
    } = this.props;

    e.preventDefault();
    this.handleClose();
    resetPassword({ password, passwordCfm, username }, true);
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { submitting, pristine, invalid } = this.props;
    const { open } = this.state;
    return (
      <Wrapper>
        <Btn
          variant="outlined"
          size="small"
          color="secondary"
          onClick={() => this.handleOpen()}
        >
          Reset password
        </Btn>
        <Dialog
          open={open}
          onClose={() => this.handleClose()}
          aria-labelledby="editResetForm"
        >
          <DialogTitle id="editResetForm">Reset password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Fill the form to update your password.
            </DialogContentText>
            <Separator variant="middle" />
            <form onSubmit={this.handleSubmit}>
              <Field
                name="password"
                type="password"
                label="Password"
                component={InputText}
              />
              <Field
                name="passwordCfm"
                type="password"
                label="Confirm password"
                component={InputText}
              />
              <Separator variant="middle" />
              <SubmitBtn>
                <Button
                  type="submit"
                  color="secondary"
                  disabled={pristine || invalid || submitting}
                >
                  Save
                </Button>
                <Button onClick={() => this.handleClose()} color="primary">
                  Cancel
                </Button>
              </SubmitBtn>
            </form>
          </DialogContent>
        </Dialog>
      </Wrapper>
    );
  }
}

EditResetForm = reduxForm({
  form: "editResetForm",
  validate: validateEditResetForm
})(EditResetForm);

const mapStateToProps = state => ({
  formValues: getFormValues("editResetForm")(state),
  invalid: isInvalid("editResetForm")(state),
  username: state.users.currentUser.username
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditResetForm);
