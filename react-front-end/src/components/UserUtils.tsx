function isUserLoggedIn() : boolean {
    return localStorage.getItem("userid") != null;
}

export { isUserLoggedIn };