import { useNavigate } from "react-router";
import GenerateInputRowFormat from "../components/InputRowGenerator";
import { BasicButton, SubmitButton } from "../components/Button";

function FormTable(props:{
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
                        return GenerateInputRowFormat(inputName, props.inputTypes[index], props.inputValues[index]);
                    })
                }               
                <SubmitButton color="black" buttonName={props.actionName.toLocaleUpperCase()} />              
            </form>
            <BasicButton color="black" buttonName="BACK" clickHandler={() => navigate(props.backUrl)} />
        </div>
    )
}

export default FormTable;