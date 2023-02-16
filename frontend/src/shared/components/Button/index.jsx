import Button from "@mui/material/Button";

export const ButtonCustomize = (props) => {
    const { variant, size, color, children, other} = props;

    return <Button variant={variant} size={size} color={color} {...other}>
        {children}
    </Button>
}