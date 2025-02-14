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
            actionHandler={(event: FormEvent<HTMLFormElement>) => {
                if (SignUp({formSubmitEvent: event})) {
                    navigate("/index");
                }
            }}
            backUrl="/index"/>
    )
}

export default SignUpPage;