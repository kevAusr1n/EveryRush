import { Dispatch, SetStateAction, useRef } from "react";

function SearchBar(props: {
    searchTerm : string,
    setSearchTerm : Dispatch<SetStateAction<string>>,
    orderTerm : string,
    setOrderTerm : Dispatch<SetStateAction<string>>
}) 
{
    const tempSearchTerm = useRef("");
    
    return (
        <div className="flex justify-center items-center md-10">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                    leading-tight focus:outline-none focus:shadow-outline" id="search" type="text"
                    placeholder="product name etc." onChange={(e) => tempSearchTerm.current = e.target.value}/>
            <button onClick={() => props.setSearchTerm(tempSearchTerm.current)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
            py-2 px-4 rounded-full mr-2">
                Search
            </button>
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