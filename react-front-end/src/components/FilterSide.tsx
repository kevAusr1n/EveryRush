import { Dispatch, SetStateAction } from "react"
import ResponsiveDiv from "./div/ResponsiveDiv";

function FilterSide(props: {
    setArrangement: Dispatch<SetStateAction<string>>,
    orderTerms: string[],
    setOrderTerm: Dispatch<SetStateAction<string>>,
}) {
    const gridArrangement = "grid grid-cols-4"
    const rowArrangement = "grid grid-cols-1";

    return (
        <ResponsiveDiv style="flex flex-col shadow mt-20 gap-3" children={[
            <ResponsiveDiv style="flex flex-row gap-5" children={[
                <strong className="texf-xxl">Display Arragement</strong>,
                <div className="flex flex-row">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={() => props.setArrangement(gridArrangement)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={() => props.setArrangement(rowArrangement)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </div>
            ]} />,
            <strong className="texf-xxl">Order By</strong>,
            <ResponsiveDiv style="flex flex-col gap-2" children={[
                props.orderTerms.map((orderTerm : string) => {
                    return (
                        <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input id="checkbox-item-11" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                            <label htmlFor="checkbox-item-11" className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">{orderTerm}</label>
                        </div>
                    )
                })
            ]} />,
            <strong className="texf-xxl">Filtered By</strong>,
            <ResponsiveDiv style="flex flex-row gap-2" children={[
                <label>Price:</label>,
                <p>$</p>,
                <input className="border-1 rounded w-20" type="text"></input>,
                <p> - </p>,
                <p>$</p>,
                <input className="border-1 rounded w-20" type="text"></input>,
            ]} />
        ]} />
    )
}

export default FilterSide

                