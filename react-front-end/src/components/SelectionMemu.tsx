function SelectionMenu (props: {
    default_value: string | number,
    values: string[] | number[],
    valueChangeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void
}){
    return (
        <select defaultValue={props.default_value} className="bg-white border text-black px-3 py-2" onInput={props.valueChangeHandler}>
            {props.values.map((value) => {
                return (<option key={value} value={value}>{value}</option>)
            })}
        </select>
    )
}

export default SelectionMenu;