import { useNavigate } from 'react-router';
import { FormEvent } from 'react';
import { SignIn } from '../functions/UserFunction';
import SubmitForm from '../components/SubmitForm';
import GoogleAuthButton from '../components/GoogleAuthButton';
import ResponsiveDiv from '../components/div/ResponsiveDiv';

function SignInPage() {
    const navigate = useNavigate()

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={[
            <ResponsiveDiv style="mt-50 mb-50 gap-5 p-20 flex flex-col items-center bg-white shadow" children={[
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
                    style="w-100"
                />,
                <GoogleAuthButton />
            ]} />
        ]} />
    )
}

export default SignInPage;