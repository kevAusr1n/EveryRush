import { useNavigate } from "react-router";
import { BlackButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";

function SignInRequiredPage(props: {message: string}) {
    const navigate = useNavigate();

    return <ResponsiveDiv style="flex flex-col items-center" children={[
        <ResponsiveDiv style="mt-50 mb-50 gap-5 p-20 flex flex-col items-center" children={[
            <p className="text-xl">Please sign in to access {props.message}</p>,
            <BlackButton buttonName="SIGN IN" size="w-50 h-20" clickHandler={() => navigate("/signin")} />
        ]} />   
    ]} />
}

export default SignInRequiredPage;