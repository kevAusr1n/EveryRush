import { useNavigate } from 'react-router';
import { signUpFromForm } from '../functions/UserFunction';
import { FormEvent, useState } from 'react';
import SubmitForm from '../components/SubmitForm';
import ResponsiveDiv from '../components/div/ResponsiveDiv';

function SignUpPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={[
            <ResponsiveDiv style="mt-20 mb-50 gap-5 p-20 flex flex-col items-center bg-white shadow-xl" children={[
                <SubmitForm
                    inputNames={["email", "username", "password", "password confirm", "role"]}
                    inputTypes={["text", "text", "password", "password", "option"]}
                    inputValues={["", "", "", "", "Customer,BusinessOwner"]}
                    inputStyles={["w-100", "w-100", "w-100", "w-100", "w-100"]}
                    stateSetters={[setEmail, null, null, null, null]}
                    actionName="REGISTER"
                    actionHandler={async (event: FormEvent<HTMLFormElement>) => {
                        if (await signUpFromForm({formSubmitEvent: event})) {
                            navigate(`/signup-confirm?email=${email}`);
                        }
                    }}
                />
            ]} />
        ]} />
    )
}

export default SignUpPage;