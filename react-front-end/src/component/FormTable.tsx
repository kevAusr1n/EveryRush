import { useState } from 'react';
import { Link, redirect } from 'react-router';

function GenerateInputRowFormat(inputName : string, inputType: string, inputValue: string) {
    const [_, setState] = useState(inputValue);

    if (inputType == "text") {
        return (
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {inputName}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow-outline" id={inputName} type="text"
                value={inputValue} onChange={(e) => setState(e.target.value)}/>
            </div>
        )
    }
    else if (inputType == "option") {
        const optionValues = inputValue.split(",");
        return (
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {inputName}
                </label>
                <select>
                    {
                        optionValues.map((optionValue) => {
                            return <option value = {optionValue}>{optionValue}</option>
                        })
                    }
                </select>
            </div>
        )
    }

    return <div className="mb-4"></div>
}

function FormTable(props: {
    inputNames: Array<string>, 
    inputTypes: Array<string>,
    inputValues: Array<string>,
    actionName : string, 
    actionHandler : any}) 
{
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
                    {props.actionName}
                </button>
                <Link to="/">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                    focus:outline-none focus:shadow-outline" onClick={() => {return redirect("/");}}>
                        Back
                    </button>
                </Link>
            </form>
        </div>
    )
}

export default FormTable;