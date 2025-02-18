import { useState } from 'react';
import ResponsiveDiv from './div/ResponsiveDiv';
import { X } from 'lucide-react';
import ImageBrief from './ImageBrief';

const basicFieldStyle = "shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
const basicLabelStyle = "block text-gray-700 text-sm font-bold mb-2";

function TextField(props: {inputName: string, inputType: string, inputValue: string, style: string}) {
    const [_, setState] = useState(props.inputValue);
    
    return (
        <>
            <label className={basicLabelStyle}>{props.inputName.toLocaleLowerCase()}</label>
            <input className={props.style + " " + basicFieldStyle} defaultValue={props.inputValue} 
                id={props.inputName.toLocaleLowerCase()} name={props.inputName.toLocaleLowerCase()} type="text"
                onChange={(e) => setState(e.target.value)}
            />
        </>
    )
}

function OptionField(props: {inputName: string, inputType: string, inputValue: string, style: string}) {
    const optionValues = props.inputValue.split(",");

    return (
        <>
            <label className={basicLabelStyle}>{props.inputName}</label>
            <select>
                {
                    optionValues.map((optionValue) => {
                        return <option value = {optionValue}>{optionValue}</option>
                    })
                }
            </select>
        </>
    )
}

function FileField(props: {
    inputName: string, 
    inputType: string, 
    inputValue: [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>],
    style: string}) 
{
    const [files, setFiles] = props.inputValue as [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>];
    const [errorMsg, setErrorMsg] = useState("");

    const addImage = (fileList: FileList) => {
        const dataTransfer = new DataTransfer();

        for (let i = 0; i < fileList.length; i++) {
            if (!fileList[i].type.startsWith("image")) {
                setErrorMsg("cannot upload files out of .jpeg or .png");
                return;
            }
            if (fileList[i].size > 2048000) {
                setErrorMsg("cannot upload files larger than 2MB");
                return;
            }
        }
        
        if (fileList == null) {
            return;
        }
        
        if (files == null) {
            setFiles(fileList);
        } else {
            for (let i = 0; i < files.length; i++) {
                dataTransfer.items.add(files[i]);
            }
            for (let i = 0; i < fileList.length; i++) {
                dataTransfer.items.add(fileList[i]);
            }
            setFiles(dataTransfer.files)
        }      

        setErrorMsg("");
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

    const visibleImageStyle = "w-32 h-32 opacity-100";
    const halfTransparentImageStyle = "w-32 h-32 opacity-50";
    const invisibleDeleteButtonStyle = "opacity-0 h-16 w-16 absolute inset-8 flex items-center justify-center bg-red-500 text-white";
    const visibleDeleteButtonStyle = "opacity-100 h-16 w-16 absolute inset-8 flex items-center justify-center bg-red-500 text-white";

    const eventHandlerMap = (imageId: string, buttonId: string) => {
        return {
            onMouseOver: () => {
                document.getElementById(imageId)?.setAttribute("class", halfTransparentImageStyle);
                document.getElementById(buttonId)?.setAttribute("class", visibleDeleteButtonStyle);
            },
            onMouseOut: () => {
                document.getElementById(imageId)?.setAttribute("class", visibleImageStyle);
                document.getElementById(buttonId)?.setAttribute("class", invisibleDeleteButtonStyle);
            }
        }
    };

    return (
        <>
            <label className={basicLabelStyle}>{props.inputName}</label>
            <label className={props.style + " " + basicFieldStyle} htmlFor={props.inputName.toLocaleLowerCase()}>
                Upload Product Pictures
            </label>
            <input id={props.inputName.toLocaleLowerCase()} name={props.inputName.toLocaleLowerCase()} 
                type="file" multiple hidden onChange={(e) => addImage(e.target.files as FileList)}/>
            <ResponsiveDiv style="m-10 h-10" children={[<p className="text-red-500">{errorMsg}</p>]} />
            <ResponsiveDiv style="flex flex-row h-40" children={[
                files && Array.from(files).map((file) => {
                    const id = crypto.randomUUID();
                    const imageId = crypto.randomUUID();
                    const deleteButtonId = crypto.randomUUID();
                    return (
                        <ResponsiveDiv id={id} style="relative m-1 h-32 w-32" eventHandlerMap={eventHandlerMap(imageId, deleteButtonId)} children={[
                            <ImageBrief id={imageId} src={URL.createObjectURL(file)} style={visibleImageStyle} />,
                            <button id={deleteButtonId} className={invisibleDeleteButtonStyle} onClick={() => deleteFromFiles(file)}>
                                <X />
                            </button>
                        ]}/>
                    )
                })
            ]}/>
        </>
    )
}

function InputField(props: {
    inputName : string, 
    inputType: string, 
    inputValue: string | [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>],
    style: string
}) {
    switch (props.inputType) {
        case "text":
            return <TextField inputName={props.inputName} inputType={props.inputType} inputValue={props.inputValue as string} style={props.style} />
        case "option":
            return <OptionField inputName={props.inputName} inputType={props.inputType} inputValue={props.inputValue as string} style={props.style} />
        case "file":
            return <FileField inputName={props.inputName} inputType={props.inputType} inputValue={props.inputValue as [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>]} style={props.style} />
        default:
            return <></> 
    }
}

export default InputField;