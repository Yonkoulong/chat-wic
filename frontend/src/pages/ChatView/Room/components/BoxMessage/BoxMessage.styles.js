import styled, { css } from 'styled-components';
import { Box, Typography } from '@/shared/components';
import { whiteColor } from '@/shared/utils/colors.utils';

export const BoxMessageContainer = styled(Box)`
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    backgroundColor: ${whiteColor};
`