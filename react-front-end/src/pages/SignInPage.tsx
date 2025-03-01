import { useNavigate } from 'react-router';
import { FormEvent, useState } from 'react';
import { signIn } from '../functions/UserFunction';
import SubmitForm from '../components/SubmitForm';
import ResponsiveDiv from '../components/div/ResponsiveDiv';
import { MonoStyleText } from '../components/Text';

function SignInPage() {
    const navigate = useNavigate()
    const [signInResultMsg, setSignInResultMsg] = useState("");

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={[
            <ResponsiveDiv style="mt-20 mb-50 gap-5 p-20 flex flex-col items-center bg-white shadow-xl" children={[
                <SubmitForm
                    inputNames={["email", "password"]}
                    inputTypes={["text", "password"]}
                    inputValues={["", ""]}
                    inputStyles={["w-100", "w-100"]}
                    actionName="SIGN IN"
                    actionHandler={async (event: FormEvent<HTMLFormElement>) => {
                        var result : string = await signIn({formSubmitEvent: event});
                        if (result == "success") {
                            navigate("/");
                            window.location.reload();
                        } else {
                            setSignInResultMsg(result);
                        }
                    }}
                />,
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
                </button>,
                <a href='/password-reset' className="font-mono text-blue-500 underline">Forget your password?</a>,
                <MonoStyleText style='text-red-500' content={signInResultMsg} />
            ]} />
        ]} />
    )
}

export default SignInPage;