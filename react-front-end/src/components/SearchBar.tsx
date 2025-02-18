import { Dispatch, SetStateAction, useRef } from "react";
import { Search } from "lucide-react";
import ResponsiveDiv from "./div/ResponsiveDiv";

function SearchBar(props: {
    searchTerm : string,
    setSearchTerm : Dispatch<SetStateAction<string>>,
}) {
    const tempSearchTerm = useRef("");

    return (   
        <ResponsiveDiv style="flex flex-row w-100 justify-center bg-white rounded-lg border" children={[
            <input className="relative w-full h-12 left-2 outline-none" type="text" onChange={(e) => tempSearchTerm.current = e.target.value} />,
            <Search className="relative top-3 right-2" onClick={() => props.setSearchTerm(tempSearchTerm.current)} />  
        ]}/>
    )
}

export default SearchBar;