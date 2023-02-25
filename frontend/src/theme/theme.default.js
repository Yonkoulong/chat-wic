const theme = {};

theme.palette = {
  type: "light",
  common: {
    black: "#000",
    white: "#fff",
    placeholder: "#b4bac0",
    light: "#ffffff",
    hover: "#E6ECFF",
  },
  primary: {
    main: "#E44160",
    light: "rgb(51, 51, 51)",
    dark: "rgb(217 88 113)",
    contrastText: "#fafafa",
  },
  info: {
    main: "#1769aa",
    light: "rgb(51, 51, 51)",
    dark: "rgb(0, 0, 0)",
    contrastText: "#fafafa",
  },
  secondary: {
    light: "#E44160",
    main: "#E44160",
    dark: "#c51162",
    contrastText: "#fff",
    popUpText: "#7B7F84",
    warning: "#B4BAC0",
    file: "#FFEAEA",
    available: "#34BA96",
    break: "#FFC107",
  },
  tertiary: {
    main: "#ff4081",
    light: "rgb(51, 51, 51)",
    dark: "rgb(0, 0, 0)",
    contrastText: "#000",
  },
  error: {
    light: "#e57373",
    main: "#f44336",
    dark: "#d32f2f",
    contrastText: "#fff",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    A100: "#d5d5d5",
    A200: "#aaaaaa",
    A400: "#303030",
    A700: "#616161",
  },
  overlay: {
    light: "rgba(23, 28, 33, 0.2)",
    base: "rgba(23, 28, 33, 0.4)",
    dark: "rgba(23, 28, 33, 0.6)",
  },
  contrastThreshold: 3,
  tonalOffset: 0.2,
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.54)",
    disabled: "rgba(0, 0, 0, 0.38)",
    hint: "rgba(0, 0, 0, 0.38)",
    high: "#ffffff",
    medium: "rgba(255, 255, 255, 0.7)",
    low: "rgba(255, 255, 255, 0.6)",
    link: "#4567d6",
    success: "#51ad32",
    error: "#ff0000",
    info: "#1769aa",
  },
  divider: "rgba(0, 0, 0, 0.12)",
  background: {
    paper: "#fff",
    default: "#fafafa",
    level1: "#F1F3F4",
    level2: "#d8dde2",
    level3: "#ffeaea",
    bgSuccess: "#eafff2",
    bgError: "#ffeded",
  },
  action: {
    active: "rgba(0, 0, 0, 0.54)",
    hover: "rgba(0, 0, 0, 0.08)",
    hoverOpacity: 0.08,
    selected: "rgba(0, 0, 0, 0.14)",
    disabled: "rgba(0, 0, 0, 0.26)",
    disabledBackground: "rgba(0, 0, 0, 0.12)",
  },
  success: {
    main: "#00843e",
  },
};

export default theme;
