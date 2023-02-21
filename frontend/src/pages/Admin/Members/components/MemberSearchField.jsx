import React from 'react';

import styled, { css } from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment } from "@/shared/components";

const TableCellSearchInput = styled(TextField)`
    ${({ theme: {  } }) => css`
        fieldSet {
        border-radius: 50px;
    }
    &&& {
        background-color: white;
        border-radius: 50px;
    }
    `} 
`;

export const MemberSearchField = ({ placeHolder, fieldName }) => {
    
    const handleSearchKey = () => {

    }

    return (
        <>
            <TableCellSearchInput 
                placeholder={placeHolder}
                fullWidth
                name={fieldName}
                size="small"
                value={""}
                onChange={handleSearchKey}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start" sx={{ cursor: "pointer" }}>
                            <SearchIcon fontSize='small' />
                        </InputAdornment>
                    )
                }}
            />
        </>
    )
}