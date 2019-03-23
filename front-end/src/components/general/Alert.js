import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import { Btn } from "../../style/deleteAccount";

export class Alert extends React.Component {
  _isMounted = false;
  state = {
    open: false
  };

  componentDidMount = () => {
    this._isMounted = true;
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

  handleAction = () => {
    const { action } = this.props;
    this.handleClose();
    action();
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { open } = this.state;
    return (
      <div>
        <Btn size="small" onClick={() => this.handleOpen()}>
          Delete account
        </Btn>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete account</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure that you want to delete your account with all your
              data ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAction} color="secondary">
              Agree
            </Button>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Disagree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Alert;
