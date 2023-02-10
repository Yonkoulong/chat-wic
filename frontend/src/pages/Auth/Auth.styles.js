import styled from 'styled-components';
import { Box } from '@/shared/components';

export const AuthViewContainer = styled(Box)`
    display: flex;
    width: 100%;
    height: 100vh; 
    overflow: hidden;
`

export const AuthViewImageLeft = styled(Box)`
    width: 50%;

`

export const AuthViewImage = styled('img')`
    width: 100%;
    height: 100%;
`

export const AuthViewContentRight = styled(Box)`
    width: 50%;
`