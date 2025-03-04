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
    name: string, 
    value: string, 
    type: string,
    style: string,
    readonly?: boolean,
    valueChangeHandler: (value: any) => void
}) {
    return (
        <ResponsiveDiv style="" children={<>
            <label className={basicLabelStyle}>{props.name.toLocaleUpperCase()}</label>
            <input className={props.readonly == true ? props.style + " " + readOnlyTestFieldStyle : props.style + " " + basicTextFieldStyle} 
                value={props.value} 
                id={props.name.toLocaleLowerCase()} 
                name={props.name.toLocaleLowerCase()}
                type={props.type} 
                onChange={(e) => props.valueChangeHandler(e)} 
                readOnly={props.readonly == true ? true : false}
            />
        </>}/>
    )
}

function TextAreaInput(props: {
    name: string, 
    value: string, 
    style: string,
    readonly?: boolean,
    valueChangeHandler: (value: any) => void
}) {
    return (
        <ResponsiveDiv style="" children={<>
            <label className={basicLabelStyle}>{props.name.toLocaleUpperCase()}</label>
            <textarea className={props.style + " h-50 " + basicTextFieldStyle} 
                value={props.value} 
                id={props.name.toLocaleLowerCase()} 
                name={props.name.toLocaleLowerCase()}
                onChange={(e) => props.valueChangeHandler(e)}
            />
        </>}/>
    )
}

function OptionInput(props: {
    name: string, 
    value: string | number, 
    style: string, 
    options: string[] | number[],
    valueChangeHandler: (value: any) => void
}) {
    const optionValues: string[] | number[] = props.options;
    const [dropDown, setDropDown] = useState(false);
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
                if (typeof props.value == "number") {
                    props.valueChangeHandler(parseInt(value));
                } else {
                    props.valueChangeHandler(value);
                }
            }
        }
    };

    return (        
        <ResponsiveDiv style={"flex flex-col"} eventHandlerMap={{onMouseOut: () => setDropDown(false)}} children={<>
            {!isStringEmpty(props.name) && <label className={basicLabelStyle}>{props.name.toLocaleLowerCase()}</label>}
            <input id={id} 
                name={props.name} 
                type="text" 
                value={props.value}
                className={optionWidth + " h-10 text-center font-mono border-b-1 hover:bg-black hover:text-white focus:outline-none"} 
                onClick={() => setDropDown(!dropDown)} 
                readOnly 
            />
            <ResponsiveDiv style="" children={<>
                <DropDown dropDown={dropDown} items={optionValues.map(v => v.toString())} style={optionWidth} eventHandlerMap={defaultHandler} />
            </>} />
        </>} />     
    )
}

function ImageUrlInput(props: {
    name: string, 
    value: string, 
    style: string, 
    valueChangeHandler: (value: any) => void
}) {
    const [imageUrls, setImageUrls] = useState<string>(props.value);
    const imageUrlArr: string[] = props.value.split(",");
    const [urlStatuses, setUrlStatuses] = useState<boolean[]>(new Array(imageUrlArr.length).fill(true));
    
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
                setImageUrls(imageUrlArr.filter((_, i) => (i == statusIndex && !urlStatuses[i]) || (i != statusIndex && urlStatuses[i])).join(","));
                props.valueChangeHandler(imageUrlArr.filter((_, i) => (i == statusIndex && !urlStatuses[i]) || (i != statusIndex && urlStatuses[i])).join(","));
                setUrlStatuses((prevArray) => prevArray.map((value, i) => (i === statusIndex ? !value : value)));
            }
        }
    }
    
    return <ResponsiveDiv style={"flex flex-col gap-5 " + props.style} children={<>
                <label className={basicLabelStyle}>{props.name.toLocaleUpperCase()}</label> 
                <input id={props.name.toLocaleLowerCase()} 
                    name={props.name.toLocaleLowerCase()} 
                    type="text" 
                    value={imageUrls} 
                    hidden
                    onChange={(e) => setImageUrls(e.target.value)} 
                />   
                <ResponsiveDiv style="flex flex-row mt-3 mb-3 gap-2" children={<> 
                    {
                        imageUrlArr.map((imageUrl, index) => {   
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
    name: string, 
    value: [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>],
    style: string
}) {
    const [files, setFiles] = props.value as [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>];
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
        <ResponsiveDiv style="flex flex-col h-100 gap-5" children={<>
            <label className={basicLabelStyle}>{props.name.toLocaleUpperCase()}</label> 
            <label className={props.style + " " + basicTextFieldStyle + " trainsition hover:scale-102 hover:bg-black hover:text-white"} htmlFor={props.name.toLocaleLowerCase()}>
                Upload Product Pictures
            </label>
            <MonoStyleText style="text-green-400 bg-green-200 border-1 border-green-300 p-2" content="upload at least 1 images with .jpeg/.png format of <= 2MB" />   
            <input id={props.name.toLocaleLowerCase()} 
                name={props.name.toLocaleLowerCase()} 
                type="file" 
                multiple 
                hidden 
                onChange={(e) => addImage(e.target.files as FileList)}
            />
            <ResponsiveDiv style="mt-2 mb-2 h-10" children={<MonoStyleText style="text-red-500" content={errorMsg} />} />
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
    name : string, 
    type: string, 
    value: string | number | [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>],
    style: string,
    options?: string[],
    valueChangeHandler?: (value: any) => void
}) {
    switch (props.type) {
        case "text":
        case "password":
            return <TextInput name={props.name} type={props.type} value={props.value as string} style={props.style} 
                valueChangeHandler={props.valueChangeHandler as (value: any) => void}/>
        case "textarea":
            return <TextAreaInput name={props.name} value={props.value as string} style={props.style} 
                valueChangeHandler={props.valueChangeHandler as (value: any) => void} />
        case "option":
            return <OptionInput name={props.name} value={props.value as string} style={props.style} options={props.options as string[]} 
                valueChangeHandler={props.valueChangeHandler as (value: any) => void}/>
        case "imageUrl":
            return <ImageUrlInput name={props.name} value={props.value as string} style={props.style} 
                valueChangeHandler={props.valueChangeHandler as (value: any) => void} />
        case "image":
            return <ImageInput name={props.name} value={props.value as [FileList | null, React.Dispatch<React.SetStateAction<FileList | null>>]} style={props.style} />
        default:
            return <></> 
    }
}



export default InputField;
export { OptionInput, TextInput }