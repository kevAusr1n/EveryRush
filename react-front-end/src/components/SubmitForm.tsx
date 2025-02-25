import { BlackButton, SubmitButton } from "./Button";
import InputField from "./InputField";
import ResponsiveDiv from "./div/ResponsiveDiv";

function SubmitForm(props:{
    inputNames: string[],
    inputTypes: string[],
    inputValues: any[],
    inputStyles: string[],
    stateSetters?: any[],
    actionName: string,
    actionHandler: any
}) {
    return (
        <form className="flex flex-col" id={"form-" + props.actionName} onSubmit={props.actionHandler} encType="multipart/form-data">
            {
                props.inputNames.map((inputName, index) => {
                    if (props.stateSetters != undefined && props.stateSetters[index] != undefined && props.stateSetters[index] != null) {
                        return (
                            <ResponsiveDiv style="mb-5" children={[
                                <InputField key={index} inputName={inputName} inputType={props.inputTypes[index]} inputValue={props.inputValues[index]} style={props.inputStyles[index]} setState={props.stateSetters[index]}/>
                            ]} />
                        )
                    } else {
                        return (
                            <ResponsiveDiv style="mb-5" children={[
                                <InputField key={index} inputName={inputName} inputType={props.inputTypes[index]} inputValue={props.inputValues[index]} style={props.inputStyles[index]} />
                            ]} />
                        )
                    }
                })
            }         
            <ResponsiveDiv style="mt-5 flex flex-col items-center" children={[
                <SubmitButton buttonName={props.actionName.toLocaleUpperCase()} size="w-60 h-10" />              
            ]} />
        </form>
    )
}

export default SubmitForm;