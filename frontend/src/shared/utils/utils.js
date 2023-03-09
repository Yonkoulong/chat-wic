export const handleEmailToName = (email) => {
    const newName = email?.split('@');
    if(newName.length > 0) {
        return newName[0];
    }

    return email;
}