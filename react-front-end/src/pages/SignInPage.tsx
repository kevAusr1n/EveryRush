import { useNavigate } from 'react-router';
import { FormEvent } from 'react';
import { SignIn } from '../functions/UserFunction';
import SubmitForm from '../components/SubmitForm';
import GoogleAuthButton from '../components/GoogleAuthButton';

function SignInPage() {
    const navigate = useNavigate()

    return (
        <>
            <SubmitForm
                inputNames={["email", "password"]}
                inputTypes={["text", "text"]}
                inputValues={["", ""]}
                actionName="SIGN IN"
                actionHandler={async (event: FormEvent<HTMLFormElement>) => {
                    if (await SignIn({formSubmitEvent: event})) {
                        navigate("/index");
                    }
                }}
                style="small"
                backUrl="/index"/>
            <div className="flex items-center justify-center">
                <GoogleAuthButton />
            </div>
        </>
    )
}

export default SignInPage;