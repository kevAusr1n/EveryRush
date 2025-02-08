import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import FormTable from './FormTable';
import axios from 'axios';

function LogIn() {
    const doLogin = async (formData : FormData) => {
        axios
            .post(`http://localhost:5175/api/auth/login`, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                sessionStorage.setItem("email", res.data.email);
            })
            .catch((err) => console.log(err));
    }
    
    const getUserInfoFromGoogle = async (tokenResponse : TokenResponse) => {
        if (tokenResponse) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    sessionStorage.setItem("email", res.data.email);
                })
                .catch((err) => console.log(err));
        }
    }

    const checkGoogleUserRegistered = async (email : string) => {
        axios
            .get(`http://localhost:5175/api/auth/third-party-login-user-exist-check/${email}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                if (res.data.email != "none") {
                    sessionStorage.setItem("username", res.data.username);
                    sessionStorage.setItem("role", res.data.role);
                }
                sessionStorage.setItem("user_registered", (res.data.email != "none").toString());
            })
            .catch((err) => console.log(err));
    }

    const setupGoogleUser = (tokenResponse : TokenResponse) => {
        getUserInfoFromGoogle(tokenResponse);
        checkGoogleUserRegistered(sessionStorage.getItem("email") as string);
        window.location.href = "/";
    }

    return (
        <div>
            <FormTable 
                inputNames={["Email", "Password"]}
                inputTypes={["text", "text"]}
                inputValues={["", ""]}
                actionName="SIGNIN" 
                actionHandler={doLogin}/>
            <div className="flex items-center justify-center">
                <button 
                    className = "border bg-white hover:bg-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    onClick={useGoogleLogin({
                            onSuccess: (tokenResponse) => setupGoogleUser(tokenResponse),
                            onError: (error) => console.log(error)
                        })
                }>
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}

export default LogIn;