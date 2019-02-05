import React from "react";
import styled from "styled-components";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";

import { capitalizeFirstChar } from "../../utils/tools";

const FormControlStyled = styled(FormControl)`
  color: ${props => props.theme.color.secondary};
`;
const FormLabelStyled = styled(FormLabel)`
  color: ${props => props.theme.color.secondary};
`;
const RadioGroupStyled = styled(RadioGroup)`
  color: ${props => props.theme.color.secondary};
`;
const FormControlLabelStyled = styled(FormControlLabel)`
  color: ${props => props.theme.color.secondary};
`;

class InputRadio extends React.Component {
  render() {
    const {
      name,
      label,
      inputs,
      value,
      handleChange,
    } = this.props;

    return (
      <div>
        <FormLabelStyled component="legend">
          {label}
        </FormLabelStyled>
        <RadioGroupStyled
          aria-label={label}
          name={name}
          value={value}
          onChange={handleChange}
        >
        {inputs.map((input, index) => (
          <FormControlLabelStyled
            key={index}
            label={capitalizeFirstChar(input)}
            value={input}
            control={<Radio />}
            checked={input === value}
          />
        ))}
        </RadioGroupStyled>
        </div>
    );
  }
}

export default InputRadio;
