import { Dispatch, SetStateAction, useRef } from "react";
import { BasicButton } from "./Button";
import BasicDiv from "./div/BasicDiv";
import FlexDiv from "./div/FlexDiv";

function SearchBar(props: {
    searchTerm : string,
    setSearchTerm : Dispatch<SetStateAction<string>>,
    orderTerm : string,
    setOrderTerm : Dispatch<SetStateAction<string>>,
    setArrangement : Dispatch<SetStateAction<string>>,
}) {
    const tempSearchTerm = useRef("");
    const [gridArrangement, rowArrangement] = ["grid grid-cols-4", "grid grid-cols-1"];

    return (
        <BasicDiv style="bg-white" children={[
            <FlexDiv flexType="flex-row" style="w-full justify-center gap-4" children={[
                <input className="border rounded w-1/2 py-2 px-3" id="search" type="text"
                        placeholder="product name etc." onChange={(e) => tempSearchTerm.current = e.target.value}/>,
                <BasicButton buttonColor="blue-500" textColor="white" buttonName="SEARCH" clickHandler={() => props.setSearchTerm(tempSearchTerm.current)} />,
                <select className = "border rounded w-1/20 py-2 px-3" onChange={(e) => props.setOrderTerm(e.target.value)}>
                    <option value="Popularity">Popularity</option>
                    <option value="Price Ascending">Price Ascending</option>
                    <option value="Price Descending">Price Descending</option>
                    <option value="Oldest Product">Oldest Product</option>
                    <option value="Newest Product">Newest Product</option>
                </select>,
                <FlexDiv flexType="flex-row" style="justify-center" children={[
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={() => props.setArrangement(gridArrangement)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>,
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={() => props.setArrangement(rowArrangement)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>]} />
            ]}/>
        ]}/>
    )
}

export default SearchBar;