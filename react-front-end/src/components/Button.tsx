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

function SubmitButton(props: {
    size: string,
    buttonName: string
}) {
    return (
        <button type="submit" className={`bg-black text-white px-3 py-2 ${props.size} transition hover:scale-110`}>
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
        <button type="button" className={`bg-black text-white px-3 py-2 ${props.size} transition hover:scale-110`} onClick={props.clickHandler}>
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
        <button type="button" className={`bg-white text-black px-3 py-2 border-1 ${props.size} transition hover:scale-110`} onClick={props.clickHandler}>
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
        <button type="button" className={`bg-white border-red-500 border-1 text-red-500 px-3 py-2 ${props.size} transition hover:scale-110`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

export { BorderlessButton, SubmitButton, BlackButton, WhiteButton, RedButton };