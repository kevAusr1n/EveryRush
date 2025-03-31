import { useRef, useState } from "react";
import { BlackButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import InputField from "../components/InputField";
import { resetPassword, sendPasswordResetEmail } from "../functions/UserFunction";
import { useNavigate } from "react-router";
import { MonoStyleText } from "../components/Text";

function PasswordResetPage() {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmedNewPassword, setConfirmedNewPassword] = useState("");
    const resetPasswordResultMsg = useRef("");
    const sendEmailResultMsg = useRef("");

    const sendPasswordResetEmailHandler = async () => {
        if (!await sendPasswordResetEmail({email: email})) {
            sendEmailResultMsg.current = "Email doesn't exist";
            setRefresh(!refresh);
        } else {
            sendEmailResultMsg.current = "Please use reset code sent to your email to reset password.";
            setDropDown(true);
        }
    }

    const resetPasswordHandler = async () => {
        if (newPassword != confirmedNewPassword) {
            resetPasswordResultMsg.current = "New password and confirmed password do not match."
            setRefresh(!refresh);
        }
        if (await resetPassword({email: email, code: code, newPassword: newPassword})) {
            navigate("/signin");
        } else {
            resetPasswordResultMsg.current = "Reset failed."
            setRefresh(!refresh);
        }
    }

    return (
        <ResponsiveDiv style="flex flex-col mt-40 items-center" children={<>
            <ResponsiveDiv style="flex items-center md:items-start flex-col gap-5" children={<>
                <InputField name="Please enter your email for reset" type="text" value={email} style="w-full md:w-100 lg:w-200" valueChangeHandler={(e) => setEmail(e.target.value)}/>
                <BlackButton buttonName="SEND" size="w-40 h-10" clickHandler={() => {
                    sendPasswordResetEmailHandler();
                }} />
                <MonoStyleText style="text-red-500" content={sendEmailResultMsg.current} />
            </>} />
            {dropDown && <ResponsiveDiv style="flex items-center md:items-start flex-col mt-5 gap-5" children={<>
                <InputField name="Reset Code" type="text" value={code} style="w-full md:w-100 lg:w-200" valueChangeHandler={(e) => setCode(e.target.value)}/>
                <InputField name="New Password" type="password" value={newPassword} style="w-full md:w-100 lg:w-200" valueChangeHandler={(e) => setNewPassword(e.target.value)}/>
                <InputField name="Confirm New Password" type="password" value={confirmedNewPassword} style="w-full md:w-100 lg:w-200" valueChangeHandler={(e) => setConfirmedNewPassword(e.target.value)}/>
                <ResponsiveDiv style="flex flex-col md:flex-row gap-5" children={<>
                    <BlackButton buttonName="RESET" size="w-40 h-10" clickHandler={() => resetPasswordHandler()}/>
                    <BlackButton buttonName="BACK" size="w-40 h-10" clickHandler={() => {
                        sendEmailResultMsg.current = "";
                        resetPasswordResultMsg.current = "";
                        setDropDown(false)}
                    }/>
                </>} />
                <MonoStyleText style="text-red-500" content={resetPasswordResultMsg.current} />
            </>} />}
        </>} />
    )
}

export default PasswordResetPage;