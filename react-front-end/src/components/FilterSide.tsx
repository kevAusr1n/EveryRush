import { Dispatch, SetStateAction } from "react"
import ResponsiveDiv from "./div/ResponsiveDiv";
import { WhiteButton } from "./Button";
import SearchBar from "./SearchBar";
import { MonoStyleText } from "./Text";

//const selectedStyle = "bg-indigo-500 text-white scale-110";
const orderTermStyle = "bg-white text-black transition hover:scale-110 font-mono";
const filterLableStype = "bg-black text-white font-bold w-full text-center";

function FilterSide(props: {
    setArrangement: Dispatch<SetStateAction<string>>,
    orderTerms: string[],
    setOrderTerm: Dispatch<SetStateAction<string>>,
    searchTerm: string,
    setSearchTerm: Dispatch<SetStateAction<string>>
}) {
    const gridArrangement = "grid grid-cols-4"
    const rowArrangement = "grid grid-cols-1";

    return (
        <ResponsiveDiv style="w-full grid grid-cols-1" children={[
            <ResponsiveDiv style="w-full flex flex-row justify-between mb-1" children={[
                <ResponsiveDiv style="w-3/4 mb-5" children={[
                    <SearchBar
                        placeHolder="product etc ..."
                        searchTerm={props.searchTerm}
                        setSearchTerm={props.setSearchTerm}
                    />
                ]} />,
                <ResponsiveDiv style="flex flex-row" children={[
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={() => props.setArrangement(gridArrangement)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>,
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={() => props.setArrangement(rowArrangement)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                ]} />
            ]} />,
            <ResponsiveDiv style="flex flex-col items-start mt-2 gap-2 mb-1" children={[
                <MonoStyleText style={filterLableStype} content="ORDER" />,
                props.orderTerms.map((orderTerm : string, index : number) => {
                    return (
                        <button id={props.orderTerms[index]} key={index} className={orderTermStyle} onClick={() => {           
                            props.setOrderTerm(orderTerm);
                        }} >
                            {orderTerm}
                        </button>
                    )
                })
            ]} />,
            <ResponsiveDiv style="w-full flex flex-col items-start mt-2" children={[
                <MonoStyleText style={filterLableStype} content="FILTER" />,
                <ResponsiveDiv style="w-full flex flex-row mt-5 gap-2" children={[
                    <label className="font-mono">PRICE:</label>,
                    <p>$</p>,
                    <input className="border-1 w-1/4 font-mono focus:outline-none" type="text"></input>,
                    <p> - </p>,
                    <p>$</p>,
                    <input className="border-1 w-1/4 font-mono focus:outline-none" type="text"></input>,
                ]} />,
                <ResponsiveDiv style="flex flex-row mt-5" children={[
                    <WhiteButton buttonName="APPLY" size="h-10" clickHandler={() => {}}/>
                ]} />
            ]} />
        ]} />
    )
}

export default FilterSide

                