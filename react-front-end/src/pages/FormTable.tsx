import { useNavigate } from "react-router";
import GenerateInputRowFormat from "../components/InputRowGenerator";
import { BasicButton, SubmitButton } from "../components/Button";

function FormTable(props:{
    inputNames: string[],
    inputTypes: string[],
    inputValues: any[],
    actionName: string,
    actionHandler: any,
    backUrl: string
}) {
    const navigate = useNavigate();
    const safeSubmit = (formId : string) => {
        let form = document.getElementById(formId);
        
        if (form != null && form instanceof HTMLFormElement) {
            (form as HTMLFormElement).submit();
        }
    }

    return (
        <div className="mt-50 flex items-center justify-center">
            <form id={"form-" + props.actionName} action={props.actionHandler}>
                {
                    props.inputNames.map((inputName, index) => {
                        return GenerateInputRowFormat(inputName, props.inputTypes[index], props.inputValues[index]);
                    })
                }               
                <SubmitButton color="black" buttonName={props.actionName.toLocaleUpperCase()} />              
                <BasicButton color="black" buttonName="BACK" clickHandler={() => navigate(props.backUrl)} />
            </form>
        </div>
    )
}

export default FormTable;