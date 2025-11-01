import { Input } from "antd";
import styled from "styled-components";

export const WrapperInputStyle = styled(Input)`
  outline: none;
  width: 300px;
  height: 50px;
  border: 1px solid grey;
  &:focus {
    background-color: rgb(232, 240, 254);
    border-top: none;
    border-right: none;
    border-left: none;
  }
`;
