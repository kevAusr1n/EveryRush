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
            sendEmailResultMsg.current = "Email does not exist."
            setRefresh(!refresh);
        } else {
            sendEmailResultMsg.current = "A email has been sent to your mailbox. Please use reset code inside to reset your password.";
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
            <ResponsiveDiv style="flex flex-col gap-5" children={<>
                <InputField inputName="Please enter your email for reset" inputType="text" inputValue={email} style="w-200" onTextChangeHandler={setEmail}/>
                <BlackButton buttonName="SEND" size="w-40 h-10" clickHandler={() => {
                    sendPasswordResetEmailHandler();
                }} />
                <MonoStyleText style="text-red-500" content={sendEmailResultMsg.current} />
            </>} />
            {dropDown && <ResponsiveDiv style="flex flex-col mt-5 gap-5" children={<>
                <InputField inputName="Reset Code" inputType="text" inputValue={code} style="w-200" onTextChangeHandler={setCode}/>
                <InputField inputName="New Password" inputType="password" inputValue={newPassword} style="w-200" onTextChangeHandler={setNewPassword}/>
                <InputField inputName="Confirm New Password" inputType="password" inputValue={confirmedNewPassword} style="w-200" onTextChangeHandler={setConfirmedNewPassword}/>
                <ResponsiveDiv style="flex flex-row gap-5" children={<>
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