function isStringEmpty(value: string) {
    return !(value != null && value != undefined && value.trim() !== "" && value.trim() !== "null");
}

function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPassword(value: string) {
    if (isStringEmpty(value)) {
        return false;
    }
    if (value.length < 8 || value.length > 20) {
        return false;
    }
    if (!/[A-Z]/.test(value)) {
        return false;
    }
    if (!/[0-9]/.test(value)) {
        return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return false;
    }
    return true;
}

function isStrSame(value1: string, value2: string) {
    return value1 === value2;
}

function isNonNegativeInteger(value: string) {
    if (isStringEmpty(value)) {
        return false;
    }
    const num = Number(value);
    return !isNaN(num) && Number.isInteger(num) && num >= 0;
}

function isPositiveNumber(value: string) {
    const num = Number(value);
    return !isNaN(num) && num > 0;
}

export { isStringEmpty, isStrSame, isValidEmail, isValidPassword, isPositiveNumber as isNonNegativeNumber, isNonNegativeInteger };