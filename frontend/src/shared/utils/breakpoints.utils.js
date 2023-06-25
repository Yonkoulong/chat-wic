export const size = {
  desktop: '1023px',
  mobile: '768px',
};

export const device = {
  desktop: `@media (min-width: ${size.desktop})`,
  tablet: `@media (max-width: ${size.desktop}) and (min-width: ${size.mobile})`,
  mobile: `@media (max-width: ${size.mobile})`,
};
