function BorderlessButton (props: {
    textColor: string,
    buttonColor: string,
    buttonName: string, 
    clickHandler: () => void
}) {
    return (
        <button className={`${props.buttonColor} ${props.textColor} px-3 py-2`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function BasicButton(props: {
    textColor: string,
    buttonColor: string,
    borderColor?: string,
    buttonName: string,
    clickHandler: () => void
}) {
    let buttonWidth : number = Math.max(40, props.buttonName.length * 3);
    
    return (
        <button className={`${props.buttonColor} ${props.textColor} ${props.borderColor != undefined ? props.borderColor : ""} w-${buttonWidth} h-10 px-3 py-2`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function SubmitButton(props: {
    style: string,
    buttonName: string
}) {
    return (    
        <button type="submit" className={props.style}>
            {props.buttonName}
        </button>
    )
}

export { BorderlessButton, BasicButton, SubmitButton };