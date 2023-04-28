import React from 'react';
import { Select, MenuItem } from '@/shared/components';
import { isArray } from '@/shared/utils/constant';

export const SelectCustomize = ({options, field}) => {
    return <Select fullWidth value={field.value} onChange={(newVal) => field.onChange(newVal)}>   
        { isArray(options) &&
            options.map((option) => 
                <MenuItem key={option.value} value={options.value}>{option.label}</MenuItem>
            )
        }
    </Select>
}