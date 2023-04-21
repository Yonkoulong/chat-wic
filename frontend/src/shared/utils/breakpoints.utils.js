export const size = {
  desktopL: '2560px',
  desktop: '1600px',
  laptopXl: '1440px',
  laptopL: '1439px',
  laptopS: '1023px',
  tablet: '768px',
  mobile: '739px',
};

export const device = {
  desktopL: `(min-width: ${size.desktopL})`,
  desktop: `(min-width): ${size.desktop}`,
  laptopXl: `(min-width: ${size.laptopXl})`,
  laptopL: `(max-width: ${size.laptopL})`,
  laptopS: `(max-width: ${size.laptopS})`,
  tablet: `(max-width: ${size.laptopS}) and (min-width: ${size.tablet})`,
  mobile: `(max-width: ${size.mobile})`,
};
