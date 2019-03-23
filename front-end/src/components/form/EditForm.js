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
import { Wrapper, Btn, Separator, SubmitBtn } from "../../style/editForm";
import allTheActions from "../../actions";
import InputText from "./InputText";
import InputAvatar from "./InputAvatar";
import SelectText from "./SelectText";

const validateEditForm = values => {
  const { username, email, avatar, firstname, lastname } = values;
  const errors = {};

  if (
    username &&
    !/^(?!.*--.*)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9._-]+$/i.test(username.trim())
  )
    errors.username = "It must contain alpha characters";
  if (username && username.length < 4)
    errors.username = "Username is too short (4 characters minimum)";
  if (username && username.length > 30)
    errors.username = "Username is too long (30 characters maximum)";
  if (email && !/^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.trim()))
    errors.email = "Please enter a valid email";
  if (avatar && avatar.length < 1) errors.avatar = "Avatar is missing";
  if (firstname && firstname.length < 4)
    errors.firstname = "First name is too short (4 characters minimum)";
  if (firstname && firstname.length > 30)
    errors.firstname = "First name is too long (30 characters maximum)";
  if (firstname && !/^(?!.*--.*)[a-zA-Z-]+$/i.test(firstname.trim()))
    errors.firstname = "It must contain alpha characters";
  if (lastname && lastname.length < 4)
    errors.lastname = "Last name is too short (4 characters minimum)";
  if (lastname && lastname.length > 30)
    errors.lastname = "Last name is too long (30 characters maximum)";
  if (lastname && !/^(?!.*--.*)[a-zA-Z-]+$/i.test(lastname.trim()))
    errors.lastname = "It must contain alpha characters";
  return errors;
};

export class EditForm extends React.Component {
  _isMounted = false;
  state = {
    open: false,
    avatarPic: ""
  };

  componentDidMount() {
    this._isMounted = true;
  }

  handleChange = async e => {
    const { uploadAvatar } = this.props.actions.users;
    if (e.target.files[0]) {
      let file = e.target.files[0];
      await uploadAvatar(file, null);
      if (this._isMounted) {
        this.setState({ avatarPic: this.props.avatar });
      }
    }
  };

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

  handleSubmit = async e => {
    const {
      email,
      username,
      firstname,
      lastname,
      lang
    } = this.props.formValues;
    const {
      actions: {
        users: { updateUser }
      },
      currentAvatar
    } = this.props;

    const { avatarPic } = this.state;

    e.preventDefault();
    await updateUser(
      {
        email,
        username,
        firstname,
        lastname,
        lang,
        avatar: avatarPic || currentAvatar
      },
      avatarPic
    );
    this.handleClose();
  };

  componentWillUnmout() {
    this._isMounted = false;
  }

  renderFields = () => {
    const { currentAvatar } = this.props;
    const items = [
      { value: "en", label: "English" },
      { value: "fr", label: "Français" }
    ];
    return (
      <div>
        <Field
          name="avatar"
          label="upload-avatar"
          type="file"
          currentavatar={currentAvatar}
          component={InputAvatar}
          avatarpic={this.state.avatarPic}
          onChange={this.handleChange}
        />
        <Field name="username" label="Username" component={InputText} />
        <Field name="email" label="Email" type="email" component={InputText} />
        <Field name="firstname" label="First Name" component={InputText} />
        <Field name="lastname" label="Last Name" component={InputText} />
        <Field
          name="lang"
          label="Language"
          items={items}
          component={SelectText}
        />
      </div>
    );
  };

  render() {
    const { submitting, pristine, invalid } = this.props;
    const { open } = this.state;
    return (
      <Wrapper>
        <Btn size="small" onClick={() => this.handleOpen()}>
          Edit
        </Btn>
        <Dialog
          open={open}
          onClose={() => this.handleClose()}
          aria-labelledby="editForm"
        >
          <DialogTitle id="editForm">Edit</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To update your profile, please replace the info.
            </DialogContentText>
            <Separator variant="middle" />
            <form onSubmit={this.handleSubmit} encType="multipart/form-data">
              {this.renderFields()}
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

EditForm = reduxForm({
  form: "editForm",
  validate: validateEditForm,
  enableReinitialize: true
})(EditForm);

const mapStateToProps = state => ({
  formValues: getFormValues("editForm")(state),
  invalid: isInvalid("editForm")(state),
  initialValues: state.users.currentUser,
  currentAvatar: state.users.currentUser.avatar,
  avatar: state.users.avatar
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditForm);
