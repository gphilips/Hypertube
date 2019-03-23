import React from "react";
import styled from "styled-components";
import { FormControl, Select, MenuItem, InputLabel } from "@material-ui/core";

const Wrap = styled.div`
  margin: 30px 0 10px;
`;
const Selector = styled(FormControl)`
  display: flex;
  border-radius: 5px;
  background-color: #d1d1d1;
`;
const Label = styled(InputLabel)`
  color: ${props => props.theme.color.darkText};
`;
const Menu = styled(Select)`
  color: ${props => props.theme.color.black};
`;

export class SelectText extends React.Component {
  _isMounted = false;
  state = {
    open: false
  };
  componentDidMount() {
    this._isMounted = true;
  }

  handleClose = () => {
    if (this._isMounted) {
      this.setState({ open: false });
    }
  };

  handleOpen = () => {
    if (this._isMounted) {
      this.setState({ open: true });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { input, label, items } = this.props;
    const { open } = this.state;
    return (
      <Wrap>
        <Selector>
          <Label>{label}</Label>
          <Menu
            open={open}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
            onChange={(event, index, value) => input.onChange(value)}
            inputProps={{ name: "lang" }}
            {...input}
          >
            {items &&
              items[0] &&
              items.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
          </Menu>
        </Selector>
      </Wrap>
    );
  }
}

export default SelectText;
