import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { data, useNavigate } from 'react-router';
import GenerateInputRowFormat from '../functions/InputRowGenerator';
import FormTable from './FormTable';

function LogIn() {
    const navigate = useNavigate()

    const doLogin = (formData : FormData) => {
        var requestJson = {
            email : formData.get("email") as string,
            password : formData.get("password") as string
        }

        axios
            .post(`http://localhost:5175/api/auth/signin`, requestJson, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*)'
                }
            })
            .then((res) => {
                if (res.data.email != "none") {
                    localStorage.setItem("userid", res.data.id);
                    localStorage.setItem("email", res.data.email);
                    localStorage.setItem("username", res.data.userName);
                    localStorage.setItem("role", res.data.role);
                    navigate("/")
                }
            })
            .catch((err) => alert(err));
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
                    localStorage.setItem("userid", res.data.id);
                    localStorage.setItem("email", res.data.email);
                    localStorage.setItem("username", res.data.userName);
                    localStorage.setItem("role", res.data.role);
                    localStorage.setItem("provider", "google");
                }
                sessionStorage.setItem("user_registered", (res.data.email != "none").toString());
            })
            .catch((err) => console.log(err));
    }

    const setupGoogleUser = (tokenResponse : TokenResponse) => {
        getUserInfoFromGoogle(tokenResponse);
        checkGoogleUserRegistered(sessionStorage.getItem("email") as string);
        navigate("/");
    }

    return (
        <>
            <FormTable 
                inputNames={["email", "password"]}
                inputTypes={["text", "text"]}
                inputValues={["", ""]}
                actionName="SIGN IN"
                actionHandler={doLogin}
                backUrl="/"/>
            <div className="flex items-center justify-center">
                <button 
                    className = "border bg-white hover:bg-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    onClick={() => useGoogleLogin({
                            onSuccess: (tokenResponse) => setupGoogleUser(tokenResponse),
                            onError: (error) => console.log(error)
                        })
                }>
                    Sign in with Google
                </button>
            </div>
        </>
    )
}

export default LogIn;