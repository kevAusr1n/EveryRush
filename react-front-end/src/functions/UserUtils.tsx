function isUserLoggedIn() : boolean {
    return localStorage.getItem("user") != null;
}

export { isUserLoggedIn };