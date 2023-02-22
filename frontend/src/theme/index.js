import { createTheme } from "@mui/material/styles";
import merge from "lodash.merge";
import themeDefault from "./theme.default";

const theme = () => {
  const themeValues = createTheme(merge(themeDefault));
  return themeValues;
};

export default theme;
