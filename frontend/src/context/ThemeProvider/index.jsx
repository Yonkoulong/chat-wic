import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "@/theme";

export const ThemeProvider = ({children}) => {
     const themeValues = theme();

     return (
          <>
          <CssBaseline />
          <StyledThemeProvider theme={themeValues}>
               <MuiThemeProvider theme={themeValues}>{children}</MuiThemeProvider>
          </StyledThemeProvider>   
          </>
          )
}
