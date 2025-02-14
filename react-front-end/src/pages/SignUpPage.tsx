import { useNavigate } from 'react-router';
import FormTable from './FormTable';
import { SignUp } from '../functions/UserFunction';
import { FormEvent } from 'react';

function SignUpPage() {
    const navigate = useNavigate()

    return (
        <FormTable
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