import { useNavigate } from "react-router";
import GenerateInputRowFormat from "../functions/InputRowGenerator";

function FormTable(props:{
    inputNames: string[],
    inputTypes: string[],
    inputValues: string[],
    actionName: string,
    actionHandler: any
    backUrl: string
}) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center">
            <form action={props.actionHandler} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {
                    props.inputNames.map((inputName, index) => {
                        return GenerateInputRowFormat(inputName, props.inputTypes[index], props.inputValues[index]);
                    })
                }
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                focus:outline-none focus:shadow-outline" type="submit">
                    {props.actionName.toLocaleUpperCase()}
                </button>                 
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                focus:outline-none focus:shadow-outline" onClick={() => navigate(props.backUrl)}>
                    Back
                </button>
            </form>
        </div>
    )
}

export default FormTable;