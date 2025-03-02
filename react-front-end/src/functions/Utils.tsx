function isStringEmpty(str: string) {
    return !(str != null && str != undefined && str.trim() !== "" && str.trim() !== "null");
}

export { isStringEmpty };