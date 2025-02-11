import { ReactNode, useState } from 'react';

function GenerateInputRowFormat(inputName : string, inputType: string, inputValue: string) {
    const [_, setState] = useState(inputValue);
    const [files, setFiles] = useState<FileList | null>(null);
    
    const addImageToFiles = (fileList: FileList) => {
        const dataTransfer = new DataTransfer();

        for (let i = 0; i < fileList.length; i++) {
            if (!fileList[i].type.startsWith("image")) {
                alert("cannot upload non-image files");
                return;
            }
        }

        if (files == null) {
            setFiles(fileList);
        } else if (fileList == null) {
            return;
        } else {
            for (let i = 0; i < files.length; i++) {
                dataTransfer.items.add(files[i]);
            }
            for (let i = 0; i < fileList.length; i++) {
                dataTransfer.items.add(fileList[i]);
            }
            setFiles(dataTransfer.files)
        }      
    }

    const deleteFromFiles = (file : File) => {
        const dataTransfer = new DataTransfer();
        
        if (files == null) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            if (files[i] != file) {
                dataTransfer.items.add(files[i]);
            }
        }

        setFiles(dataTransfer.files);
    }

    if (inputType == "text") {
        return (
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {inputName}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow-outline" defaultValue={inputValue} 
                id={inputName.toLocaleLowerCase()} name={inputName.toLocaleLowerCase()} type="text"
                onChange={(e) => setState(e.target.value)}/>
            </div>
        )
    }
    else if (inputType == "fixed-text") {
        return (
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {inputName}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow-outline" value={inputValue} 
                id={inputName.toLocaleLowerCase()} name={inputName.toLocaleLowerCase()} type="text"
                onChange={(e) => setState(e.target.value)}/>
            </div>
        )
    } else if (inputType == "option") {
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
    } else if (inputType == "file") {
        return (
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {inputName}
                </label>
                <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                    focus:outline-none focus:shadow-outline" htmlFor={inputName.toLocaleLowerCase()}>
                    Upload Product Pictures
                </label>
                <input id={inputName.toLocaleLowerCase()} 
                    name={inputName.toLocaleLowerCase()} type="file" multiple hidden
                    onChange={(e) => addImageToFiles(e.target.files as FileList)}/>
                {files && Array.from(files).map((file) => {
                    return (
                        <div>
                            <p>{file.name}</p>
                            <img src={URL.createObjectURL(file)} alt="uploaded" className="w-32 h-32"/>
                            <button onClick={() => deleteFromFiles(file)}>Delete</button>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default GenerateInputRowFormat;