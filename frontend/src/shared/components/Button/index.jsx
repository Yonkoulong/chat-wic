import LoadingButton from '@mui/lab/LoadingButton';

export const ButtonCustomize = (props) => {
  const { variant, size, color, children, onClick } = props;

  return (
    <LoadingButton
      variant={variant}
      size={size}
      color={color}
      onClick={onClick}
      {...props}
    >
      {children}
    </LoadingButton>
  );
};
