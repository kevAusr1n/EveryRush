import { useNavigate } from "react-router";
import { BasicButton, SubmitButton } from "./Button";
import InputField from "./InputField";

function SubmitForm(props:{
    inputNames: string[],
    inputTypes: string[],
    inputValues: any[],
    actionName: string,
    actionHandler: any,
    backUrl: string,
}) {
    const navigate = useNavigate();
    
    return (
        <div className="mt-50 flex items-center justify-center">
            <form id={"form-" + props.actionName} onSubmit={props.actionHandler} encType="multipart/form-data">
                {
                    props.inputNames.map((inputName, index) => {
                        return InputField(inputName, props.inputTypes[index], props.inputValues[index]);
                    })
                }               
                <SubmitButton buttonColor="blue-500" textColor="white" buttonName={props.actionName.toLocaleUpperCase()} />              
            </form>
            <BasicButton buttonColor="blue-500" textColor="white" buttonName="BACK" clickHandler={() => navigate(props.backUrl)} />
        </div>
    )
}

export default SubmitForm;