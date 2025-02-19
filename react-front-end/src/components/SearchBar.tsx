import { Dispatch, SetStateAction, useRef } from "react";
import { Search } from "lucide-react";
import ResponsiveDiv from "./div/ResponsiveDiv";

function SearchBar(props: {
    searchTerm : string,
    setSearchTerm : Dispatch<SetStateAction<string>>,
}) {
    const tempSearchTerm = useRef("");

    return (   
        <ResponsiveDiv style="flex flex-row bg-white border" children={[
            <input className="outline-none" type="text" onChange={(e) => tempSearchTerm.current = e.target.value} />,
            <Search onClick={() => props.setSearchTerm(tempSearchTerm.current)} />  
        ]}/>
    )
}

export default SearchBar;