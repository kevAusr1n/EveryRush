import { useNavigate } from "react-router";
import { createElement } from "react";
import { BasicButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";

function SignInRequiredPage(props: {message: string}) {
    const navigate = useNavigate();

    return <ResponsiveDiv style="bg-swhite" children={[
        createElement("p", {className: "text-xxl"}, `Please sign in to access ${props.message}.`),
        <BasicButton buttonColor="blue-500" textColor="white" buttonName="SIGN IN" clickHandler={() => navigate("/signin")} />
    ]} />
}

export default SignInRequiredPage;