import LoadingButton from '@mui/lab/LoadingButton';

export const ButtonCustomize = (props) => {
  const { variant, size, color, children, handleClick } = props;

  return (
    <LoadingButton
      variant={variant}
      size={size}
      color={color}
      onClick={handleClick}
      {...props}
    >
      {children}
    </LoadingButton>
  );
};
