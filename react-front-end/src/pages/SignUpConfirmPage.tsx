import { useRef, useState } from "react";
import { BlackButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import InputField from "../components/InputField";
import { signUpConfirm } from "../functions/UserFunction";
import { useNavigate, useSearchParams } from "react-router";
import { MonoStyleText } from "../components/Text";

function SignUpConfirmPage() {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") as string;
    const [code, setCode] = useState("");
    const emailConfirmResultMsg = useRef("");

    const confirmEmailHandler = async () => {
        var apiResponse = await signUpConfirm({email: email, code: code});
        if (apiResponse.result == "success") {
            navigate("/signin");
            window.location.reload();
            emailConfirmResultMsg.current = "Email confirm failed."
            setRefresh(!refresh);
        } else {
            emailConfirmResultMsg.current = apiResponse.failureDescription;
            setRefresh(!refresh);
        }
    }

    return (
        <ResponsiveDiv style="flex flex-col mt-40 items-center" children={<>
            <ResponsiveDiv style="flex flex-col gap-5" children={<>
                <MonoStyleText style="text-xl" content={"A confirmation code is send to " + email + ". Please use it to activate your account."} />
                <InputField name="Confirmation Code" type="text" value={code} style="w-200" valueChangeHandler={setCode} />
                <BlackButton buttonName="CONFIRM" size="w-40 h-10" clickHandler={() => {
                    confirmEmailHandler();
                }} />
                <MonoStyleText style="text-red-500" content={emailConfirmResultMsg.current} />
            </>} />
        </>} />
    )
}

export default SignUpConfirmPage;