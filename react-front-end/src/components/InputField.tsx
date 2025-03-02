import { Dispatch, SetStateAction, useState } from 'react';
import ResponsiveDiv from './div/ResponsiveDiv';
import { X } from 'lucide-react';
import { ImageBrief } from './Image';
import DropDown from './Dropdown';
import { MonoStyleText } from './Text';
import { isStringEmpty } from '../functions/Utils';
import { backServerEndpoint } from '../config/BackendServerConfig';

const basicTextFieldStyle = "font-mono shadow appearance-none border py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline";
const readOnlyTestFieldStyle = "font-mono shadow appearance-none border py-2 px-3 bg-gray-200 text-black leading-tight focus:outline-none focus:shadow-outline";
const basicLabelStyle = "font-mono block text-gray-700 text-sm font-bold mb-2";
const visibleImageStyle = "p-2 border-2 w-32 h-32 opacity-100";
const halfTransparentImageStyle = "p-2 border-2 w-32 h-32 opacity-50";
const invisibleDeleteButtonStyle = "opacity-0 h-8 w-8 absolute inset-12 flex items-center justify-center bg-red-500 text-white";
const visibleDeleteButtonStyle = "opacity-100 h-8 w-8 absolute inset-12 flex items-center justify-center bg-red-500 text-white";

function TextInput(props: {
    inputName: string, 
    inputValue: string, 
    inputType: string,
    style: string,
    readonly?: boolean,
    onTextChangeHandler?: Dispatch<SetStateAction<string>>
}) {
    const [value, setValue] = useState(props.inputValue);
    return (
        <ResponsiveDiv style="" children={<>
            <label className={basicLabelStyle}>{props.inputName.toLocaleLowerCase()}</label>
            <input className={props.readonly == true ? props.style + " " + readOnlyTestFieldStyle : props.style + " " + basicTextFieldStyle} 
                value={props.onTextChangeHandler != undefined && props.onTextChangeHandler != null ? props.inputValue : value} 
                id={props.inputName.toLocaleLowerCase()} 
                name={props.inputName.toLocaleLowerCase()}
                type={props.inputType} onChange={(e) => {
                    if (props.onTextChangeHandler != undefined && props.onTextChangeHandler != null) {
                        props.onTextChangeHandler(e.target.value);
                    } else {
                        setValue(e.target.value);
                    }
                }} readOnly={props.readonly == true ? true : false}
            />
        </>}/>
    )
}

function TextAreaInput(props: {
    inputName: string, 
    inputValue: string, 
    style: string,
    readonly?: boolean,
    onTextChangeHandler?: Dispatch<SetStateAction<string>>
}) {
    const [value, setState] = useState(props.inputValue);

    return (
        <ResponsiveDiv style="" children={<>
            <label className={basicLabelStyle}>{props.inputName.toLocaleLowerCase()}</label>
            <textarea className={props.style + " h-50 " + basicTextFieldStyle} 
                value={props.onTextChangeHandler != undefined && props.onTextChangeHandler != null ? props.inputValue : value} 
                id={props.inputName.toLocaleLowerCase()} 
                name={props.inputName.toLocaleLowerCase()}
                onChange={(e) => {
                    if (props.onTextChangeHandler != undefined && props.onTextChangeHandler != null) {
                        props.onTextChangeHandler(e.target.value);
                    } else {
                        setState(e.target.value);
                    }
                }}
            />
        </>}/>
    )
}

function OptionInput(props: {
    inputName: string, 
    inputValue: string, 
    style: string, 
    inputChangeHandler?: (value: any) => void
}) {
    const optionValues: string[] = props.inputValue.split(",");
    const [dropDown, setDropDown] = useState(false);
    const [inputValueState, setInputValueState] = useState(optionValues[0]);
    const optionWidth = props.style;
    const id = crypto.randomUUID();

    const defaultHandler = (value: string) => {
        return { 
            onMouseEnter: () => {
                setDropDown(true);
            },
            onMouseMove: () => {
                setDropDown(true);
             },
            onMouseOut: () => {
                setDropDown(false);
            },
            onClick: () => {
                setInputValueState(value);
                setDropDown(false);
                if (props.inputChangeHandler != undefined) {
                    props.inputChangeHandler(value);
                }
            }
        }
    };

    return (        
        <ResponsiveDiv style={"flex flex-col"} eventHandlerMap={{onMouseOut: () => setDropDown(false)}} children={<>
            {!isStringEmpty(props.inputName) && <label className={basicLabelStyle}>{props.inputName.toLocaleLowerCase()}</label>}
            <input id={id} name={props.inputName} type="text" value={inputValueState} className={optionWidth + " h-10 text-center font-mono border-b-1 hover:bg-black hover:text-white focus:outline-none"} onClick={() => {
                setDropDown(!dropDown);
            }} readOnly />
            <ResponsiveDiv style="" children={<>
                <DropDown dropDown={dropDown} items={optionValues} style={optionWidth} eventHandlerMap={defaultHandler} />
            </>} />
        </>} />     
    )
}

function ImageUrlInput(props: {
    inputName: string, 
    inputValue: string, 
    style: string, 
}) {
    const [imageUrls, _] = useState<string[]>(props.inputValue.split(","));
    const [urlStatuses, setUrlStatuses] = useState<boolean[]>(new Array(imageUrls.length).fill(true));
    
    const eventHandlerMap = (imageId: string, buttonId: string, statusIndex: number) => {
        return {
            onMouseOver: () => {
                if (urlStatuses[statusIndex]) {
                    document.getElementById(imageId)?.setAttribute("class", halfTransparentImageStyle);
                    document.getElementById(buttonId)?.setAttribute("class", visibleDeleteButtonStyle);
                } else {
                    document.getElementById(imageId)?.setAttribute("class", visibleImageStyle);
                    document.getElementById(buttonId)?.setAttribute("class", invisibleDeleteButtonStyle);
                }
            },
            onMouseOut: () => {
                if (urlStatuses[statusIndex]) {
                    document.getElementById(imageId)?.setAttribute("class", visibleImageStyle);
                    document.getElementById(buttonId)?.setAttribute("class", invisibleDeleteButtonStyle);
                } else {
                    document.getElementById(imageId)?.setAttribute("class", halfTransparentImageStyle);
                    document.getElementById(buttonId)?.setAttribute("class", visibleDeleteButtonStyle);
                }
            },
            onClick: () => {
                if (urlStatuses[statusIndex]) {
                    document.getElementById(imageId)?.setAttribute("class", halfTransparentImageStyle);
                    document.getElementById(buttonId)?.setAttribute("class", visibleDeleteButtonStyle);
                } else {
                    document.getElementById(imageId)?.setAttribute("class", visibleImageStyle);
                    document.getElementById(buttonId)?.setAttribute("class", invisibleDeleteButtonStyle);
                }
                document.getElementById(props.inputName.toLocaleLowerCase())?.setAttribute(
                    "value", 
                    imageUrls.filter((_, i) => (i == statusIndex && !urlStatuses[i]) || (i != statusIndex &&urlStatuses[i])).join(",")
                );
                setUrlStatuses((prevArray) => prevArray.map((value, i) => (i === statusIndex ? !value : value)));
            }
        }
    }
    
    return <ResponsiveDiv style={"flex flex-col gap-5 "} children={<>
                <label className={basicLabelStyle}>{props.inputName.toLocaleLowerCase()}</label> 
                <input id={props.inputName.toLocaleLowerCase()} name={props.inputName.toLocaleLowerCase()} type="text" hidden />   
                <ResponsiveDiv style="flex flex-row mt-3 mb-3 gap-2" children={<> 
                    {
                        imageUrls.map((imageUrl, index) => {   
                            const imageId = crypto.randomUUID();
                            const deleteButtonId = crypto.randomUUID();
                            return <ResponsiveDiv key={index} style="relative h-32 w-32" eventHandlerMap={eventHandlerMap(imageId, deleteButtonId, index)} children={<>
                                <ImageBrief id={imageId} src={new URL(imageUrl, backServerEndpoint).toString()} style={visibleImageStyle} />
                                <button id={deleteButtonId} type="button" className={invisibleDeleteButtonStyle} >
                                    <X lightingColor="green" />
                                </button>
                            </>}/>         
                        })
                    }
                </>} />
            </>} />
}

function ImageInput(props: {
    inputName: string, 
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
        <ResponsiveDiv style="flex flex-col gap-5" children={<>
            <label className={basicLabelStyle}>{props.inputName}</label>
            <label className={props.style + " " + basicTextFieldStyle + " trainsition hover:scale-102 hover:bg-black hover:text-white"} htmlFor={props.inputName.toLocaleLowerCase()}>
                Upload Product Pictures
            </label>
            <input id={props.inputName.toLocaleLowerCase()} name={props.inputName.toLocaleLowerCase()} 
                type="file" multiple hidden onChange={(e) => addImage(e.target.files as FileList)}/>
            <ResponsiveDiv style="mt-2 mb-2" children={<MonoStyleText style="text-red-500" content={errorMsg} />} />
            <ResponsiveDiv style="flex flex-row mt-3 mb-3 gap-2" children={<>
                {files && Array.from(files).map((file, index) => {
                    const id = crypto.randomUUID();
                    const imageId = crypto.randomUUID();
                    const deleteButtonId = crypto.randomUUID();
                    return (
                        <ResponsiveDiv id={id} key={index} style="relative h-32 w-32" eventHandlerMap={eventHandlerMap(imageId, deleteButtonId)} children={<>
                            <ImageBrief id={imageId} src={URL.createObjectURL(file)} style={visibleImageStyle} />
                            <button id={deleteButtonId} type="button" className={invisibleDeleteButtonStyle} onClick={() => deleteFromFiles(file)}>
                                <X />
                            </button>
                        </>}/>
                    )
                })}
            </>}/>
        </>} />
    )
}

function InputField(props: {
    inputName : string, 
    inputType: string, 
    inputValue: string | [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>],
    style: string,
    onTextChangeHandler?: Dispatch<SetStateAction<string>>
}) {
    switch (props.inputType) {
        case "text":
        case "password":
            return <TextInput inputName={props.inputName} inputType={props.inputType} inputValue={props.inputValue as string} style={props.style} onTextChangeHandler={props.onTextChangeHandler}/>
        case "textarea":
            return <TextAreaInput inputName={props.inputName} inputValue={props.inputValue as string} style={props.style} onTextChangeHandler={props.onTextChangeHandler} />
        case "option":
            return <OptionInput inputName={props.inputName} inputValue={props.inputValue as string} style={props.style} />
        case "imageUrl":
            return <ImageUrlInput inputName={props.inputName} inputValue={props.inputValue as string} style={props.style} />
        case "image":
            return <ImageInput inputName={props.inputName} inputValue={props.inputValue as [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>]} style={props.style} />
        default:
            return <></> 
    }
}



export default InputField;
export { OptionInput, TextInput }