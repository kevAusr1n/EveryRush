import { Dispatch, SetStateAction, useRef } from "react";
import { Search } from "lucide-react";
import ResponsiveDiv from "./div/ResponsiveDiv";

function SearchBar(props: {
    searchTerm : string,
    setSearchTerm : Dispatch<SetStateAction<string>>,
}) {
    const tempSearchTerm = useRef("");

    return (   
        <ResponsiveDiv style="w-full flex flex-row bg-white border" children={[
            <input className="w-4/5 font-mono outline-none" type="text" onChange={(e) => tempSearchTerm.current = e.target.value} />,
            <button className="px-2" onClick={() => props.setSearchTerm(tempSearchTerm.current)}><Search /></button>
        ]}/>
    )
}

export default SearchBar;