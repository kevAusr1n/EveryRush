import { useNavigate } from 'react-router';
import { signUp } from '../functions/UserFunction';
import { useState } from 'react';
import ResponsiveDiv from '../components/div/ResponsiveDiv';
import { MonoStyleText } from '../components/Text';
import { Input } from '../type/ObjectType';
import InputField from '../components/InputField';
import { BlackButton } from '../components/Button';
import { isStringEmpty, isStrSame, isValidEmail, isValidPassword } from '../functions/Utils';

function SignUpPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [role, setRole] = useState("Customer");

    const [emailCheckMsg, setEmailCheckMsg] = useState("");
    const [passwordCheckMsg, setPasswordCheckMsg] = useState("");
    const [passwordConfirmCheckMsg, setPasswordConfirmCheckMsg] = useState("");
    const [signUpResultMsg, setSignUpResultMsg] = useState("");

    const signUpInputs: Input[] = [
        { name: "email", type: "text", value: email, style: "w-100", 
            valueChangeHandler: (e) => {
                setEmail(e.target.value);
                if (!isValidEmail(e.target.value)) {
                    setEmailCheckMsg("Please enter a valid email");
                } else {
                    setEmailCheckMsg("");
                }
            } 
        },
        { name: "username", type: "text", value: username, style: "w-100", valueChangeHandler: (e) => setUsername(e.target.value) },
        { name: "password", type: "password", value: password, style: "w-100",
            valueChangeHandler: (e) => {
                setPassword(e.target.value);
                if (!isValidPassword(e.target.value)) {
                    setPasswordCheckMsg("Please enter a valid password");
                } else {
                    setPasswordCheckMsg("");
                }
            } 
        },
        { name: "password confirm", type: "password", value: passwordConfirm, style: "w-100", valueChangeHandler: (e) => {
                setPasswordConfirm(e.target.value);
                if (!isStrSame(e.target.value, password)) {
                    setPasswordConfirmCheckMsg("Passwords not same");
                } else {
                    setPasswordConfirmCheckMsg("");
                }
            } 
        },
        { name: "role", type: "option", value: role, options: ["Customer", "BusinessOwner"], style:"w-100", valueChangeHandler: setRole },
    ];


    const checkMsgs: string[] = [emailCheckMsg, "", passwordCheckMsg, passwordConfirmCheckMsg, ""];

    const signUpHandler = async () => {
        if (isStringEmpty(email) 
            || isStringEmpty(username) 
            || isStringEmpty(password) 
            || isStringEmpty(passwordConfirm)
            || isStringEmpty(role)) {
            return;
        }

        if (!checkMsgs.every(msg => isStringEmpty(msg))) {
            return;
        }

        var apiResponse = await signUp({
            username: username,
            password: password,
            email: email,
            role: role,
            provider: ""
        });
        if (apiResponse.result == "success") {
            navigate(`/signup-confirm?email=${email}`);
        } else {
            setSignUpResultMsg(apiResponse.failureDescription);
        }
    };

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={<>
            <ResponsiveDiv style="mt-20 mb-50 gap-5 p-20 flex flex-col items-center bg-white shadow-xl gap-5" children={<>
                {
                    signUpInputs.map((signUpInput, index) => {
                        return <ResponsiveDiv key={index} style="flex flex-col items-start gap-5" children={<>
                            <InputField name={signUpInput.name} 
                                type={signUpInput.type} 
                                value={signUpInput.value} 
                                style={signUpInput.style} 
                                options={signUpInput.options}
                                valueChangeHandler={signUpInput.valueChangeHandler} 
                            />
                            <MonoStyleText style="text-red-500" content={checkMsgs[index]} />
                            {
                                signUpInput.name == "password" && 
                                <ResponsiveDiv style="flex flex-col p-5 bg-green-200 border-1 border-green-300" children={<>
                                    <MonoStyleText style="text-green-400" content="Your password must contains:" />
                                    <li className="text-sm font-mono text-green-400">At least one number</li>
                                    <li className="text-sm font-mono text-green-400">At least one upper character</li>
                                    <li className="text-sm font-mono text-green-400">At least one specicial case, eg. @#$</li>
                                    <li className="text-sm font-mono text-green-400">Length between 8-20</li>
                                </>} />
                            }
                        </>} />
                    })
                }
                <BlackButton buttonName="SIGN UP" size="w-60 h-10" clickHandler={() => signUpHandler()} />
                <MonoStyleText style="text-red-500" content={signUpResultMsg} />
            </>} />
        </>} />
    )
}

export default SignUpPage;