import { useState } from 'react';

function InputField(
    inputName : string, 
    inputType: string, 
    inputValue: string | [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>],
) {

    if (inputType == "text") {
        inputValue = inputValue as string;
        const [_, setState] = useState(inputValue);

        return (
            <>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {inputName}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow-outline" defaultValue={inputValue} 
                id={inputName.toLocaleLowerCase()} name={inputName.toLocaleLowerCase()} type="text"
                onChange={(e) => setState(e.target.value)}/>
            </>
        )
    }
    else if (inputType == "fixed-text") {
        inputValue = inputValue as string;
        const [_, setState] = useState(inputValue);

        return (
            <>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {inputName}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow-outline" value={inputValue} 
                id={inputName.toLocaleLowerCase()} name={inputName.toLocaleLowerCase()} type="text"
                onChange={(e) => setState(e.target.value)}/>
            </>
        )
    } else if (inputType == "option") {
        inputValue = inputValue as string;
        const optionValues = inputValue.split(",");

        return (
            <>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {inputName}
                </label>
                <select>
                    {
                        optionValues.map((optionValue, index) => {
                            return <option value = {optionValue}>{optionValue}</option>
                        })
                    }
                </select>
            </>
        )
    } else if (inputType == "file") { 
        const [files, setFiles] = inputValue as [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>];
        
        const addImageToFiles = (fileList: FileList) => {
            const dataTransfer = new DataTransfer();
    
            for (let i = 0; i < fileList.length; i++) {
                if (!fileList[i].type.startsWith("image")) {
                    alert("cannot upload non-image files");
                    return;
                }
                if (fileList[i].size > 2048000) {
                    alert("cannot upload files larger than 2MB");
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

        return (
            <>
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
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded 
                                focus:outline-none focus:shadow-outline" 
                                onClick={() => deleteFromFiles(file)}>
                                Delete
                            </button>
                        </div>
                    )
                })}
            </>
        )
    }
}

export default InputField;