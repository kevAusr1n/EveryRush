import { useNavigate } from 'react-router';
import FormTable from './FormTable';
import { BasicButton } from '../components/Button';
import { FormEvent } from 'react';
import { SignIn } from '../functions/UserFunction';
import { googleOAuth } from '../functions/GoogleAuthFunction';

function SignInPage() {
    const navigate = useNavigate()

    return (
        <>
            <FormTable 
                inputNames={["email", "password"]}
                inputTypes={["text", "text"]}
                inputValues={["", ""]}
                actionName="SIGN IN"
                actionHandler={(event: FormEvent<HTMLFormElement>) => {
                    if (SignIn({formSubmitEvent: event})) {
                        navigate("/index");
                    }
                }}
                backUrl="/index"/>
            <div className="flex items-center justify-center">
                <BasicButton color="black" buttonName="SIGN IN WITH GOOGLE" clickHandler={() => {
                    googleOAuth();
                    if (localStorage.getItem("userid") !== null) {
                        navigate("/index");
                    } else {
                        navigate("/third-party-sign-up");
                    } 
                }} />
            </div>
        </>
    )
}

export default SignInPage;