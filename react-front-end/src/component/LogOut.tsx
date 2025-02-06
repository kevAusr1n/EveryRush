import { googleLogout } from "@react-oauth/google";

function LogOut() {
    const doLogOut = () => {
        googleLogout();
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("email");
    };

    return (<button onClick={doLogOut}>SIGN OUT</button>);
}

export default LogOut;