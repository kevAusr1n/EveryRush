import { useNavigate, useSearchParams } from "react-router";
import APICall from "../config/ApiConfig";
import axios from "axios";
import { ReactNode, useEffect, useRef, useState } from "react";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { MonoStyleText } from "../components/Text";
import { BlackButton, WhiteButton } from "../components/Button";
import { OptionInput, TextInput } from "../components/InputField";
import { isThirdPartyUserRegistered, signIn, signUp } from "../functions/UserFunction";

function ThirdPartySignInCheckPage() {
    const navigate = useNavigate();
    const windowHref = window.location.href;
    const params = windowHref.split("#")[1].split("&");
    const paramPairs = Object.fromEntries(params.map(param => param.split("=")));
    const token = paramPairs["access_token"];
    const [email, useEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Customer");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const updatePasswordErrorMsg = useRef("");
    const [passwordSetUp, setPasswordSetUp] = useState(false);

    const getGoogleUserInfo = async () => {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (await isThirdPartyUserRegistered({
            email: response.data.email,
            token: token,
            provider: "google"
        })) {
            navigate("/");
        } else {
            useEmail(response.data.email);
            setUsername(response.data.name);
        }
    }

    const thirdPartyUserRegisterHandler = async () => {
        if (await signUp({
            email: email,
            username: username,
            password: password,
            role: role,
            provider: "google",
        })) {
            navigate("/");
        }
    }

    useEffect(() => {
        getGoogleUserInfo();
    }, []);

    const passwordSetUpDiv = () : ReactNode => {
        return (
            <ResponsiveDiv style="flex flex-col" children={<>
                <TextInput inputName="New Password" inputType="password" style="w-100" inputValue="" onTextChangeHandler={setPassword}/>
                <TextInput inputName="Confirm New Password" inputType="password" style="w-100" inputValue="" onTextChangeHandler={setConfirmedPassword} />
                <MonoStyleText style="text-red-500" content={updatePasswordErrorMsg.current} />
            </>} /> 
        )
    }

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={<>
            <ResponsiveDiv style="mt-20 mb-20 gap-5 p-20 flex flex-col items-start bg-white shadow-xl" children={<>
                <ResponsiveDiv style="flex flex-row h-10 items-end gap-5" children={<>
                    <label className="font-bold font-mono">Email</label>
                    <MonoStyleText style="" content={email} />
                </>} />
                <ResponsiveDiv style="flex flex-row h-10 items-end gap-5" children={<>
                    <label className="font-bold font-mono">Username</label>
                    <MonoStyleText style="" content={username} />
                </>} />
                <ResponsiveDiv style="flex flex-row h-15 items-center gap-5" children={<>
                    <label className="font-bold font-mono">Role</label>
                    <OptionInput inputName="" inputValue="Customer,BusinessOwner" style="h-10" inputChangeHandler={(value) => setRole(value)} />
                </>} />
                <ResponsiveDiv style="flex flex-row items-center gap-5" children={<>
                    <label className="font-bold font-mono">Password</label>
                    <MonoStyleText style="" content={"set OR go with Google"} />
                    {!passwordSetUp && <WhiteButton buttonName="SET PASSWORD" size="w-40 h-10" clickHandler={() => {setPasswordSetUp(true)}}/>}
                    {passwordSetUp && <BlackButton buttonName="CANCEL" size="w-40 h-10" clickHandler={() => {setPasswordSetUp(false)}}/>}
                </>} />
                {passwordSetUp && passwordSetUpDiv()}
                <ResponsiveDiv style="mt-5" children={<>
                    <BlackButton buttonName="REGISTER" size="h-10" clickHandler={() => {
                        thirdPartyUserRegisterHandler()
                    }}/>
                </>} />
            </>} />
        </>} />
    );
}

export default ThirdPartySignInCheckPage;