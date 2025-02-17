import { useNavigate } from "react-router";
import FlexDiv from "../components/div/FlexDiv";
import { createElement } from "react";
import { BasicButton } from "../components/Button";

function SignInRequiredPage(props: {message: string}) {
    const navigate = useNavigate();

    return <FlexDiv flexType="flex-row" style="bg-swhite" children={[
        createElement("p", {className: "text-xxl"}, `Please sign in to access ${props.message}.`),
        <BasicButton buttonColor="blue-500" textColor="white" buttonName="SIGN IN" clickHandler={() => navigate("/signin")} />
    ]} />
}

export default SignInRequiredPage;