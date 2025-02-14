import Pagination from "./Pagination";

function DropDown (props: {
    isDropDown: boolean
}) {
    return (
        props.isDropDown && <div className="absolute bg-white border rounded-lg">
            <input type="text"></input>
        </div>
    )
}

export default DropDown;