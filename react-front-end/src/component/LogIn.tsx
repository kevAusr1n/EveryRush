import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { data, useNavigate } from 'react-router';
import GenerateInputRowFormat from '../functions/InputRowGenerator';

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
                    localStorage.setItem("user", res.data.email);
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
                    localStorage.setItem("user", res.data.email);
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

    const inputNames = ["email", "password"];
    const inputTypes = ["text", "text"];
    const inputValues= ["", ""];

    return (
        <>
            <div className="flex items-center justify-center">
                <form action={doLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {
                        inputNames.map((inputName, index) => {
                            return GenerateInputRowFormat(inputName, inputTypes[index], inputValues[index]);
                        })
                    }
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                    focus:outline-none focus:shadow-outline" type="submit">
                        SIGN IN
                    </button>                 
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                    focus:outline-none focus:shadow-outline" onClick={() => navigate("/")}>
                        Back
                    </button>
                </form>
            </div>
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