import { Dispatch, SetStateAction, useRef } from "react";
import { BasicButton } from "./Button";

function SearchBar(props: {
    searchTerm : string,
    setSearchTerm : Dispatch<SetStateAction<string>>,
    orderTerm : string,
    setOrderTerm : Dispatch<SetStateAction<string>>,
}) 
{
    const tempSearchTerm = useRef("");
    
    return (
        <div className="m-10 flex-row">
            <input className="border rounded w-full py-2 px-3" id="search" type="text"
                    placeholder="product name etc." onChange={(e) => tempSearchTerm.current = e.target.value}/>
            <BasicButton color="black" buttonName="SEARCH" clickHandler={() => props.setSearchTerm(tempSearchTerm.current)} />
            <select onChange={(e) => props.setOrderTerm(e.target.value)}>
                <option value="Popularity">Popularity</option>
                <option value="Price Ascending">Price Ascending</option>
                <option value="Price Descending">Price Descending</option>
                <option value="Oldest Product">Oldest Product</option>
                <option value="Newest Product">Newest Product</option>
            </select>
        </div>
    )
}

export default SearchBar;