import { useNavigate } from "react-router";
import { BasicButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";

function SignInRequiredPage(props: {message: string}) {
    const navigate = useNavigate();

    return <ResponsiveDiv style="flex flex-col items-center" children={[
        <ResponsiveDiv style="mt-50 mb-50 gap-5 p-20 flex flex-col items-center bg-white shadow" children={[
            <p className="text-xl">Please sign in to access {props.message}</p>,
            <BasicButton buttonColor="bg-blue-500" textColor="text-white" buttonName="SIGN IN" clickHandler={() => navigate("/index/signin")} />
        ]} />   
    ]} />
}

export default SignInRequiredPage;