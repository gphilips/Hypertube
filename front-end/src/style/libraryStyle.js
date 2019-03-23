import styled from "styled-components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  Typography,
  CircularProgress,
  Button,
  Select,
  FormControl
} from "@material-ui/core";

library.add(faStar);

export const Wrapper = styled.div`
  margin-top: 100px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`;

export const SearchOptions = styled.div`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 850px) {
    margin-top: 0;
  }
`;

export const LibraryContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
`;

export const MovieElement = styled.div`
  margin-top: 1px;
  margin-left: 1px;
  width: 15%;
  overflow: hidden;
  position: relative;
  @media (max-width: 1800px) {
    width: 20%;
  }
  @media (max-width: 1200px) {
    width: 30%;
  }
  @media (max-width: 850px) {
    width: 90%;
  }
`;

export const DetailsCard = styled(Card)`
  box-shadow: none !important;
  display: none;
  z-index: 100000;
  ${MovieElement}:hover & {
    display: block;
    background-color: rgba(0, 0, 0, 0.05);
    @media (max-width: 850px) {
      display: block;
      height: 50vh;
      margin-bottom: 10px;
    }
  }
  height: 100%;
  min-height: 400px;
`;

export const MovieCard = styled(Card)`
  background-color: #262626;
  border-bottom: 1px solid #262626;
  box-shadow: none !important;
  display: block;
  ${MovieElement}:hover & {
    display: none;
  }
`;

export const MovieSeen = styled.img`
  width: 45px;
  height: 45px;
  z-index: 10;
  position: absolute;
  ${MovieElement}:hover & {
    display: none;
  }
`;

export const Typo = styled(Typography)`
  color: white;
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const TitleTypo = styled(Typography)`
  color: white;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const MediumTypo = styled(Typography)`
  color: white;
  font-size: 0.8em;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const SmallTypo = styled(Typography)`
  color: white;
  font-size: 0.8em;
  text-align: justify;
  text-justify: inter-word;
  overflow: auto;
  height: 35%;
  width: 90%;
  position: absolute;
  padding-right: 5px;
  @media (max-width: 1800px) {
    height: 35%;
  }
  @media (max-width: 1200px) {
    height: 40%;
  }
`;

export const GenreTypo = styled(Typography)`
  color: white;
  font-size: 0.8em;
  font-weight: 500;
  margin-bottom: 1rem;
`;

export const Loader = styled(CircularProgress)`
  color: #e50914;
`;

export const CustomButton = styled(Button)`
  background-color: #db1b28;
  color: white;
  font-weight: bold;
  border-radius: 0;
  display: block;
  &:hover {
    transform: scale(1.2) perspective(1px);
    background-color: #e50914;
    color: white;
    padding: 0.5rem;
  }
  position: absolute;
  width: 50%;
  bottom: 30px;
  right: 0;
  left: 0;
  margin-right: auto;
  margin-left: auto;
`;

export const Options = styled.form`
  flex-flow: row no-wrap;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  display: block;
  @media (max-width: 1200px) {
    width: 100%;
  }
`;

export const SelectBlock = styled.div`
  width: 50%;
  display: block;
  @media (max-width: 800px) {
    width: 100%;
  }
  margin-top: 2rem;
`;

export const SelectGenre = styled(Select)`
  color: white;
  border-bottom: 1px solid #db1b28 !important;
  &:after {
    border-bottom: none;
  }
  width: 90% !important;
`;

export const SelectSort = styled(Select)`
  color: white;
  border-bottom: 1px solid #db1b28 !important;
  width: 90% !important;
  &:after {
    border-bottom: none;
  }
`;

export const FormStyle = styled(FormControl)`
  border-color: red;
  width: 30% !important;
  display: inline-block;
`;

export const FieldName = styled.label`
  color: white;
  font-size: medium;
  display: inline-block;
  width: 20%;
  margin-bottom: 45px;
  @media (max-width: 800px) {
    display: block;
    width: 100%;
    margin-bottom: 25px;
  }
`;

export const SearchField = styled.input`
  color: white;
  font-size: medium;
  background-color: rgba(0, 0, 0, 0.15);
  outline: none;
  border: none;
  display: inline-block;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  border-bottom: 2px solid #e50914;
  @media (max-width: 800px) {
    display: block;
    width: 90%;
    margin-bottom: 25px;
  }
`;

export const FormButton = styled(Button)`
  background-color: #db1b28;
  color: white;
  font-weight: bold;
  border-radius: 0;
  border: none;
  display: inline-block;
  width: 30%;
  margin-left: 25%;
  @media (max-width: 800px) {
    display: block;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }
`;

export const DeleteButton = styled(Button)`
  background-color: #db1b28;
  color: white;
  font-weight: bold;
  border-radius: 0;
  border: none;
  display: inline-block;
  width: 30%;
  margin-left: 10px;
  @media (max-width: 800px) {
    display: block;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
`;
