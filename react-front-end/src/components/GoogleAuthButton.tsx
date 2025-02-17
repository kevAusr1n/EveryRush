import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { BasicButton } from "./Button";

function GoogleAuthButton() {
    const googleSignIn = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            let email = "";
            const provider = "google";

            if (tokenResponse) {
                axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    email = res.data.email;
                })
                .catch((err) => console.log(err));
            }
            axios.get(`http://localhost:5175/api/auth/third-party-login-user-exist-check/${email}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                if (res.data.email != "none") {
                    localStorage.setItem("userid", res.data.id);
                    localStorage.setItem("email", res.data.email);
                    localStorage.setItem("username", res.data.userName);
                    localStorage.setItem("role", res.data.role);
                    localStorage.setItem("provider", provider);
                } else {
                    sessionStorage.setItem("email", email);
                    sessionStorage.setItem("provider", provider);
                }
            })
            .catch((err) => console.log(err));
        },
        onError: (err) => console.log(err)
    })

    return (
        <BasicButton buttonColor="green-500" textColor="white" buttonName="SIGN IN WITH GOOGLE" clickHandler={() => googleSignIn()} />
    )
}

export default GoogleAuthButton;