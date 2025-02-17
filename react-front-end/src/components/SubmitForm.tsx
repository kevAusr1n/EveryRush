import { useNavigate } from "react-router";
import { BasicButton, SubmitButton } from "./Button";
import InputField from "./InputField";
import FlexDiv from "./div/FlexDiv";

function SubmitForm(props:{
    inputNames: string[],
    inputTypes: string[],
    inputValues: any[],
    actionName: string,
    actionHandler: any,
    style: string,
    backUrl: string,
}) {
    const navigate = useNavigate();
    
    return (
        <FlexDiv flexType= "flow-cole" style="m-50 justify-center gap-5" children={[
            <form id={"form-" + props.actionName} onSubmit={props.actionHandler} encType="multipart/form-data">
                {
                    props.inputNames.map((inputName, index) => {
                        return InputField(inputName, props.inputTypes[index], props.inputValues[index], props.style);
                    })
                }               
                <SubmitButton buttonColor="blue-500" textColor="white" buttonName={props.actionName.toLocaleUpperCase()} />              
            </form>,
            <BasicButton buttonColor="blue-500" textColor="white" buttonName="BACK" clickHandler={() => navigate(props.backUrl)} />
        ]} />
    )
}

export default SubmitForm;