function BorderlessButton (props: {
    color: string,
    buttonName: string, 
    clickHandler: () => void
}) {
    return (
        <button className={`bg-white rounded-lg text-${props.color} px-3 py-2}`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function BasicButton(props: {
    color: string,
    buttonName: string, 
    clickHandler: () => void
}) {
    return (
        <button className={`bg-white rounded-lg text-${props.color} border px-3 py-2}`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function SubmitButton(props: {
    color: string,
    buttonName: string
}) {
    return (
        <button type="submit" className={`bg-white rounded-lg text-${props.color} border px-3 py-2}`}>
            {props.buttonName}
        </button>
    )
}

export { BorderlessButton, BasicButton, SubmitButton };