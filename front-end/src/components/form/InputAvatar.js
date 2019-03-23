import React from "react";
import styled from "styled-components";
import { Avatar, Button } from "@material-ui/core";
import defaultAvatar from "../../img/avatar.jpg";

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Error = styled.span`
  color: orange;
`;

class InputAvatar extends React.Component {
  _isMounted = false;
  state = {
    preview: ""
  };

  componentDidMount() {
    this._isMounted = true;
    const { currentavatar } = this.props;
    if (currentavatar && this._isMounted)
      this.setState({ preview: currentavatar });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  isValidImage = (e) => {
    e.persist();
    const { onChange } = this.props.input;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      const image = new Image();
      if (file.size) {
        reader.readAsDataURL(file);
        reader.addEventListener("load", () => {
          image.src = reader.result;
          image.onload = (ev) => {
            if (ev && ev.isTrusted)
              onChange(e);
          }
        }, false);
      }
    }
  }

  render() {
    const {
      type,
      label,
      input: { name },
      meta: { error },
      avatarpic,
      currentavatar,
      ...custom
    } = this.props;
    return (
      <div>
        <input
          type={type}
          accept="image/jpeg, image/jpg, image/png"
          id={label}
          name={name}
          onChange={e => this.isValidImage(e)}
          {...custom}
          hidden
        />
        <Wrap>
          {avatarpic && avatarpic !== "noImage" && (
            <Avatar alt="avatar" src={this.props.avatarpic} />
          )}
          {(avatarpic === "noImage" || !avatarpic) && !currentavatar && (
            <Avatar alt="avatar" src={defaultAvatar} />
          )}
          {(avatarpic === "noImage" || !avatarpic) && currentavatar && (
            <Avatar alt="avatar" src={currentavatar} />
          )}
          <label htmlFor={label}>
            <Button variant="contained" component="span">
              Upload
            </Button>
          </label>
        </Wrap>
        {error && <Error>{error}</Error>}
      </div>
    );
  }
}

export default InputAvatar;
