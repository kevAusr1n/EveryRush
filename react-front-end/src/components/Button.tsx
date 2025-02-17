function BorderlessButton (props: {
    textColor: string,
    buttonColor: string,
    buttonName: string, 
    clickHandler: () => void
}) {
    return (
        <button className={`bg-${props.buttonColor} rounded-lg text-${props.textColor} px-3 py-2}`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function BasicButton(props: {
    textColor: string,
    buttonColor: string,
    buttonName: string, 
    clickHandler: () => void
}) {
    return (
        <button className={`bg-${props.buttonColor} rounded-lg text-${props.textColor} border px-3 py-2}`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function SubmitButton(props: {
    textColor: string,
    buttonColor: string,
    buttonName: string, 
}) {
    return (    
        <button type="submit" className={`bg-${props.buttonColor} rounded-lg text-${props.textColor} border px-3 py-2}`}>
            {props.buttonName}
        </button>
    )
}

export { BorderlessButton, BasicButton, SubmitButton };