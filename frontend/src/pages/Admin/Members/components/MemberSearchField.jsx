import React, { useState, useEffect } from 'react';

import styled, { css } from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment } from "@/shared/components";
import { useDebounce } from '@/shared/hooks';

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

export const MemberSearchField = ({ placeHolder, fieldName, handleSearch, payloadRequest }) => {
    const [searchKey, setSearchKey] = useState(payloadRequest[fieldName] || "");
    const [isChangeSearchKey, setIsChangeSearchKey] = useState(false);
    const debounceSearchKey = useDebounce(searchKey);

    const handleChangeSeachKey = (event) => {
        setIsChangeSearchKey(true);
        setSearchKey(event.target?.value);
    };

    useEffect(() => {
        if(isChangeSearchKey){
            handleSearch(searchKey, fieldName);  
        }
    }, [debounceSearchKey])


    return (
        <>
            <TableCellSearchInput 
                placeholder={placeHolder}
                fullWidth
                name={fieldName}
                size="small"
                value={searchKey}
                onChange={handleChangeSeachKey}
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