function isStringEmpty(str: string) {
    return !(str != null && str.trim() !== "");
}

export { isStringEmpty };