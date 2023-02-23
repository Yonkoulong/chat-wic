import Button from "@mui/material/Button";

export const ButtonCustomize = (props) => {
    const { variant, size, color, children, handleClick, other} = props;

    return <Button variant={variant} size={size} color={color} onClick={handleClick} {...other}>
        {children}
    </Button>
}