import React from 'react';
import styled from "styled-components";
import { Box } from "@/shared/components";

const StyledBoxContainer = styled(Box)`
     height : 200px;
     display : flex;
     text-align : center;
     align-item : center;
`;

export const NoDataAvailable = () => {
  return (
    <StyledBoxContainer>No Data Available</StyledBoxContainer>
  )
};

export default NoDataAvailable;
