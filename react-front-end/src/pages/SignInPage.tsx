import { useNavigate } from 'react-router';
import { FormEvent, useState } from 'react';
import { signIn } from '../functions/UserFunction';
import SubmitForm from '../components/SubmitForm';
import GoogleAuthButton from '../components/GoogleAuthButton';
import ResponsiveDiv from '../components/div/ResponsiveDiv';

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
                <GoogleAuthButton />,
                <a href='/password-reset' className="text-blue-500 underline">Forget your password ?</a>,
                <p className='text-red-500'>{signInResultMsg}</p>
            ]} />
        ]} />
    )
}

export default SignInPage;