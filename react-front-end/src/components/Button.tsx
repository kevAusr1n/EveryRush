function BorderlessButton (props: {
    style: string,
    buttonName: string, 
    clickHandler: () => void
}) {
    return (
        <button className={`${props.style} px-3 py-2`} onClick={props.clickHandler}>
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
        <button type="button" className={`${props.buttonColor} ${props.textColor} ${props.borderColor != undefined ? props.borderColor : ""} w-${buttonWidth} h-10 px-3 py-2`} onClick={props.clickHandler}>
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

function BlackButton(props: {
    buttonName: string,
    size: string,
    clickHandler: () => void
}) {
    return (
        <button className={`bg-black text-white px-3 py-2 ${props.size} transition hover:scale-110`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function WhiteButton(props: {
    buttonName: string,
    size: string,
    clickHandler: () => void
}) {
    return (
        <button className={`bg-white text-black px-3 py-2 border-1 ${props.size} transition hover:scale-110`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function RedButton(props: {
    buttonName: string,
    size: string,
    clickHandler: () => void
}) {
    return (
        <button className={`bg-red-500 text-white px-3 py-2 ${props.size} transition hover:scale-110`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

export { BorderlessButton, BasicButton, SubmitButton, BlackButton, WhiteButton, RedButton };