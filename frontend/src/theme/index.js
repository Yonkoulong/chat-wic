import { createTheme } from "@mui/material/styles";
import { primaryColor, blackColor, whiteColor } from '@/shared/utils/colors.utils';

const theme = createTheme({
    palette: {
        primary: {
            main: primaryColor,
            contrastText: whiteColor
        },
        // secondary: {
        //     main: ${primaryColor},
        //     contrastText: ${blackColor}
        // }
    },
})

export default theme;