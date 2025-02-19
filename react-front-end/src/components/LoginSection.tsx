import { Link, useNavigate } from "react-router";
import { isUserSignedIn, SignOut } from "../functions/UserFunction";

function LoginSection() {
    const navigate = useNavigate();

    if (!isUserSignedIn()) {
        return (
            <>
                <Link to="signin"><p className="text-black">SIGN IN</p></Link>
                <Link to="signup"><p className="text-black">REGISTER</p></Link>
            </>
        );
    } else {
        return (
            <>
                <p>{localStorage.getItem("username") as string}</p>
                <button onClick={() => {
                    SignOut();
                    navigate("/index")
                }}>
                    SIGN OUT
                </button>
            </>
        );
    }
}

export default LoginSection;