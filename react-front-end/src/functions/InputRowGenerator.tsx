import { useState } from 'react';

function GenerateInputRowFormat(inputName : string, inputType: string, inputValue: string) {
    const [_, setState] = useState(inputValue);

    if (inputType == "text") {
        return (
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {inputName}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow-outline" name={inputName} type="text"
                onChange={(e) => setState(e.target.value)}/>
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
}

export default GenerateInputRowFormat;