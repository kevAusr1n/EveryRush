import { useNavigate } from 'react-router';
import { SignUp } from '../functions/UserFunction';
import { FormEvent } from 'react';
import SubmitForm from '../components/SubmitForm';

function SignUpPage() {
    const navigate = useNavigate()

    return (
        <SubmitForm
            inputNames={["email", "username", "password", "role"]}
            inputTypes={["text", "text", "text", "option"]}
            inputValues={["", "", "", "Customer,BusinessOwner"]}
            actionName="REGISTER"
            actionHandler={async (event: FormEvent<HTMLFormElement>) => {
                if (await SignUp({formSubmitEvent: event})) {
                    navigate("/index");
                }
            }}
            style="w-50"
            backUrl="/index"/>
    )
}

export default SignUpPage;