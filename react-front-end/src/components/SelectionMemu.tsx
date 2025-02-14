function SelectionMenu (props: {
    items: any[],
    inputChangeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void
}){
    return (
        <select className="bg-white border text-black px-3 py-2" onInput={props.inputChangeHandler}>
            {props.items.map((item) => {
                return (<option key={item} value={item}>{item}</option>)
            })}
        </select>
    )
}

export default SelectionMenu;