import { ReactNode, useRef, useState } from "react";
import { BlackButton, WhiteButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { TextInput } from "../components/InputField";
import { useNavigate } from "react-router";
import { EditUser, signOut } from "../functions/UserFunction";
import { isStringEmpty } from "../functions/Utils";
import { MonoStyleText } from "../components/Text";

function UserInfoEditPage() {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const updateUsernameErrorMsg = useRef("");
    const updatePasswordErrorMsg = useRef("");
    const [usernameEdit, setUsernameEdit] = useState(false);
    const [passwordEdit, setPasswordEdit] = useState(false);
    const [username, setUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmedNewPassword, setConfirmedNewPassword] = useState("");
    const editUsernameRequest = async () => {
        if (isStringEmpty(username)) {
            updateUsernameErrorMsg.current = "Username cannot be empty";
            setRefresh(!refresh);
        }
        var apiResponse = await EditUser({username: username});
        if (apiResponse.result == "success") {
            setUsernameEdit(false);
            window.location.reload();
        } else {
            updateUsernameErrorMsg.current = apiResponse.failureDescription
            setRefresh(!refresh);
        }
    }

    const editPasswordRequest = async () => {
        if (isStringEmpty(newPassword) || newPassword !== confirmedNewPassword) {
            updatePasswordErrorMsg.current = "Passwords not same";
            setRefresh(!refresh);
            return;
        } 
        var apiResponse = await EditUser({oldPassword: oldPassword, newPassword: newPassword});
        if (apiResponse.result == "success") {
            setPasswordEdit(false);
            await signOut();
            navigate("/password-changed-then-signin-required");
            window.location.reload();
        } else {
            updatePasswordErrorMsg.current = apiResponse.failureDescription;
            setRefresh(!refresh);
        }
    }

    const usernameEditDiv = () : ReactNode => {
        return (
            <ResponsiveDiv style="flex flex-col" children={<>
                <TextInput name="New Username" type="text" style="w-50 md:w-100" value={username} valueChangeHandler={(e) => setUsername(e.target.value)}/>
                <MonoStyleText style="text-red-500" content={updateUsernameErrorMsg.current} />
                <ResponsiveDiv style="flex flex-col md:flex-row gap-3 mt-5" children={<>
                    <WhiteButton buttonName="SAVE" size="h-10" clickHandler={() => editUsernameRequest()} />
                    <WhiteButton buttonName="CANCEL" size="h-10" clickHandler={() => {
                        updateUsernameErrorMsg.current = "";
                        setUsernameEdit(false);
                    }} />
                </>} />
            </>} /> 
        )
    }

    const passwordEditDiv = () : ReactNode => {
        return (
            <ResponsiveDiv style="flex flex-col" children={<>
                <TextInput name="Old Password" type="password" style="w-50 md:w-100" value={oldPassword} valueChangeHandler={(e) => setOldPassword(e.target.value)}/>
                <TextInput name="New Password" type="password" style="w-50 md:w-100" value={newPassword} valueChangeHandler={(e) => setNewPassword(e.target.value)}/>
                <TextInput name="Confirm New Password" type="password" style="w-50 md:w-100" value={confirmedNewPassword} valueChangeHandler={(e) => setConfirmedNewPassword(e.target.value)} />
                <MonoStyleText style="text-red-500" content={updatePasswordErrorMsg.current} />
                <ResponsiveDiv style="flex flex-col md:flex-row gap-3 mt-5" children={<>
                    <WhiteButton buttonName="SAVE" size="h-10" clickHandler={() => editPasswordRequest()} />
                    <WhiteButton buttonName="CANCEL" size="h-10" clickHandler={() => {
                        updatePasswordErrorMsg.current = "";
                        setPasswordEdit(false);
                    }} />
                </>} />
            </>} /> 
        )
    }

    return (
        <ResponsiveDiv style="w-full flex flex-col items-center" children={<>
            <ResponsiveDiv style="mt-20 mb-20 gap-5 p-20 flex flex-col items-start bg-white shadow-xl" children={<>
                <ResponsiveDiv style="flex flex-row items-end gap-5" children={<>
                    <label className="font-bold font-mono">Email</label>
                    <MonoStyleText style="" content={localStorage.getItem("email") as string} />
                </>} />
                <ResponsiveDiv style="w-full flex flex-row items-center justify-between" children={<>
                    <ResponsiveDiv style="flex flew-row gap-5" children={<>
                        <label className="font-bold font-mono">Username</label>
                        <MonoStyleText style="" content={localStorage.getItem("username") as string} />
                    </>} />
                    <WhiteButton buttonName="CHANGE" size="h-10" clickHandler={() => setUsernameEdit(true)}/>
                </>} />
                {(usernameEdit && usernameEditDiv())}
                <ResponsiveDiv style="w-full flex flex-row items-center justify-between" children={<>
                    <ResponsiveDiv style="flex flew-row gap-5" children={<>
                        <label className="font-bold font-mono">Password</label>
                        <MonoStyleText style="" content="********" />
                    </>} />
                    <WhiteButton buttonName="CHANGE" size="h-10" clickHandler={() => setPasswordEdit(true)} />
                </>} />
                {(passwordEdit && passwordEditDiv())}
                <ResponsiveDiv style="mt-5" children={<>
                    <BlackButton buttonName="BACK" size="h-10" clickHandler={() => navigate("/products")}/>
                </>} />
            </>} />
        </>} />
    );
}

export default UserInfoEditPage;