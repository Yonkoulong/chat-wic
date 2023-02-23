import styled, { css } from "styled-components";
import { Box, Typography, Button } from "@/shared/components";
import { primaryColor, whiteColor } from '@/shared/utils/colors.utils'

export const CreateMemberFormWrapper = styled(Box)`
    margin-top: 48px;
`

export const CreateMemberForm = styled('form')`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

export const CreateMemberInputContainer = styled(Box)`
`

export const CreateMemberFeatureWrapper = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const CreateMemberButtonSubmit = styled(Button)`
    ${({ theme: { } }) => css`
        &&& {
            background-color: ${primaryColor};
            font-size: 15px;
            color: ${whiteColor};
            font-weight: bold;
            border: none;
            outline: none;
            margin-top: 16px;
            padding: 10px 20px;
        }
  `}
`