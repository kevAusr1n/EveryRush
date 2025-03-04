import { useNavigate } from 'react-router';
import { useState } from 'react';
import ResponsiveDiv from '../components/div/ResponsiveDiv';
import { MonoStyleText } from '../components/Text';
import { ApiResponse } from '../type/ResponseType';
import { Input } from '../type/ObjectType';
import InputField from '../components/InputField';
import { BlackButton } from '../components/Button';
import { signIn } from '../functions/UserFunction';

function SignInPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInResultMsg, setSignInResultMsg] = useState("");

    const signInInputs: Input[] = [
        { name: "email", type: "text", value: email, style: "w-100", valueChangeHandler: (e) => setEmail(e.target.value) },
        { name: "password", type: "password", value: password, style: "w-100", valueChangeHandler: (e) => setPassword(e.target.value) },
    ];

    const signInHandler = async () => {
        var apiResponse : ApiResponse = await signIn({email: email, password: password});
        if (apiResponse.result == "success") {
            navigate("/");
            window.location.reload();
        } else {
            setSignInResultMsg(apiResponse.failureDescription);
        }
    };

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={<>
            <ResponsiveDiv style="mt-20 mb-50 gap-5 p-20 flex flex-col items-center bg-white shadow-xl" children={<>
                {
                    signInInputs.map((signInInput, index) => {
                        return <ResponsiveDiv key={index} style="flex flex-col items-start gap-5" children={<>
                            <InputField name={signInInput.name} 
                                type={signInInput.type} 
                                value={signInInput.value} 
                                style={signInInput.style} 
                                options={signInInput.options}
                                valueChangeHandler={signInInput.valueChangeHandler} 
                            />
                        </>} />
                    })
                }
                <BlackButton buttonName="SIGN IN" size="w-60 h-10" clickHandler={() => signInHandler()} />
                <button className="w-60 h-10 bg-white border transition hover:scale-110" onClick={() => {
                    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=999954979809-h2t8if3vj0s328ug716si26sqtllphed.apps.googleusercontent.com&scope=openid%20profile%20email&response_type=token&prompt=select_account&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fthird-party-signin-check";
                }}>
                    <span className="font-mono">SIGN IN WITH </span>
                    <span className="font-mono text-blue-500">G</span>
                    <span className="font-mono text-red-500">O</span>
                    <span className="font-mono text-yellow-500">O</span>
                    <span className="font-mono text-blue-500">G</span>
                    <span className="font-mono text-green-500">L</span>
                    <span className="font-mono text-red-500">E</span>
                </button>
                <a href='/password-reset' className="font-mono text-blue-500 underline">Forget your password?</a>
                <MonoStyleText style='text-red-500' content={signInResultMsg} />
            </>} />
        </>} />
    )
}

export default SignInPage;