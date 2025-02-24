import { useNavigate } from 'react-router';
import { SignUp } from '../functions/UserFunction';
import { FormEvent } from 'react';
import SubmitForm from '../components/SubmitForm';
import ResponsiveDiv from '../components/div/ResponsiveDiv';

function SignUpPage() {
    const navigate = useNavigate()

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={[
            <ResponsiveDiv style="mt-20 mb-50 gap-5 p-20 flex flex-col items-center bg-white shadow" children={[
                <SubmitForm
                    inputNames={["email", "username", "password", "password confirm", "role"]}
                    inputTypes={["text", "text", "password", "password", "option"]}
                    inputValues={["", "", "", "", "Customer,BusinessOwner"]}
                    inputStyles={["w-100", "w-100", "w-100", "w-100", "left,w-80"]}
                    actionName="REGISTER"
                    actionHandler={async (event: FormEvent<HTMLFormElement>) => {
                        if (await SignUp({formSubmitEvent: event})) {
                            navigate("/");
                        }
                    }}
                />
            ]} />
        ]} />
    )
}

export default SignUpPage;