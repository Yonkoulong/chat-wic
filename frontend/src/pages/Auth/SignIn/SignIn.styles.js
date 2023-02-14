import styled, { css } from 'styled-components';
import { Box, Button, Typography } from '@/shared/components';
import { primaryColor, inActiveColor, whiteColor } from '@/shared/utils/colors.utils';

export const SignInContainer = styled(Box)`
    width: 100%;
    padding: 24px 68px;
`

export const SignInWrapper = styled(Box)``

export const SignInLogo = styled.h1`
    font-size: 36px;
    color: ${primaryColor};
`

export const SignInTitle = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
`

export const SignInTitleHeading = styled('h4')`
    font-size: 24px;
    font-weight: bold;
`

export const SignInTitleDesc = styled('p')`
    ${({ theme: {} }) => css`
        font-size: 15px;
        color: ${inActiveColor};
    `}
`

export const SignInFormWrapper = styled(Box)`
    margin-top: 48px;
`

export const SignInForm = styled('form')`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

export const SignInInputContainer = styled(Box)`
`

export const SignInFeatureWrapper = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const SignInButtonSubmit = styled(Button)`
    ${({ theme: {  } }) => css`
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

export const SignInCreateAccount = styled(Typography)`
    text-align: center;
`
