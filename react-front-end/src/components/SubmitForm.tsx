import { SubmitButton } from "./Button";
import InputField from "./InputField";
import ResponsiveDiv from "./div/ResponsiveDiv";

function SubmitForm(props:{
    inputNames: string[],
    inputTypes: string[],
    inputValues: any[],
    inputStyles: string[],
    actionName: string,
    actionHandler: any
}) {
    return (
        <form className="flex flex-col" id={"form-" + props.actionName} onSubmit={props.actionHandler} encType="multipart/form-data">
            {
                props.inputNames.map((inputName, index) => {
                    return (
                        <ResponsiveDiv style="mb-5" children={[
                            <InputField key={index} inputName={inputName} inputType={props.inputTypes[index]} inputValue={props.inputValues[index]} style={props.inputStyles[index]} />
                        ]} />
                    )
                })
            }         
            <ResponsiveDiv style="mt-5 flex flex-col items-center" children={[
                <SubmitButton style="bg-blue-500 text-white border w-60 h-10" buttonName={props.actionName.toLocaleUpperCase()} />              
            ]} />
        </form>
    )
}

export default SubmitForm;