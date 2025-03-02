function BorderlessButton (props: {
    style: string,
    buttonName: string, 
    clickHandler: () => void
}) {
    return (
        <button className={`font-mono ${props.style} px-3 py-2`} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function SubmitButton(props: {
    size: string,
    buttonName: string
}) {
    return (
        <button type="submit" className={`font-mono bg-black text-white px-3 py-2 ${props.size} transition hover:scale-110`}>
            {props.buttonName}
        </button>
    )
}

function BlackButton(props: {
    id?: string,
    buttonName: string,
    size: string,
    scalable?: boolean,
    clickHandler: () => void
}) {
    return (
        <button id={props.id != undefined ? props.id: crypto.randomUUID()} type="button" className={`font-mono bg-black text-white px-3 py-2 ${props.size} ` + (props.scalable == false ? "" : "transition hover:scale-110")} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function WhiteButton(props: {
    id?: string,
    buttonName: string,
    size: string,
    scalable?: boolean,
    clickHandler: () => void
}) {
    return (
        <button id={props.id != undefined ? props.id: crypto.randomUUID()} type="button" className={`font-mono bg-white text-black px-3 py-2 border-1 ${props.size} ` + (props.scalable == false ? "" : "transition hover:scale-110")} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

function RedButton(props: {
    id?: string,
    buttonName: string,
    size: string,
    scalable?: boolean,
    clickHandler: () => void
}) {
    return (
        <button id={props.id != undefined ? props.id: crypto.randomUUID()} type="button" className={`font-mono bg-white border-red-500 border-1 text-red-500 px-3 py-2 ${props.size} ` + (props.scalable == false ? "" : "transition hover:scale-110")} onClick={props.clickHandler}>
            {props.buttonName}
        </button>
    )
}

export { BorderlessButton, SubmitButton, BlackButton, WhiteButton, RedButton };