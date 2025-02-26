import { useRef, useState } from "react";
import { BlackButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import InputField from "../components/InputField";
import { signUpConfirm } from "../functions/UserFunction";
import { useNavigate, useSearchParams } from "react-router";

function SignUpConfirmPage() {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") as string;
    const [code, setCode] = useState("");
    const emailConfirmResultMsg = useRef("");

    const confirmEmailHandler = async () => {
        if (!await signUpConfirm({email: email, code: code})) {
            emailConfirmResultMsg.current = "Email confirm failed."
            setRefresh(!refresh);
        } else {
            navigate("/signin");
            window.location.reload();
        }
    }

    return (
        <ResponsiveDiv style="flex flex-col mt-40 items-center" children={[
            <ResponsiveDiv style="flex flex-col gap-5" children={[
                <p className="text-xl">A confirmation code is send to {email}. Please use it to activate your account.</p>,
                <InputField inputName="Confirmation Code" inputType="text" inputValue="" style="w-200" onTextChangeHandler={setCode} />,
                <BlackButton buttonName="CONFIRM" size="w-40 h-10" clickHandler={() => {
                    confirmEmailHandler();
                }} />,
                <p className="text-red-500">{emailConfirmResultMsg.current}</p>
            ]} />
        ]} />
    )
}

export default SignUpConfirmPage;