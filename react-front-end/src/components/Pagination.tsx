import { Dispatch, ReactNode, SetStateAction, useRef } from "react";
import { BorderlessButton, WhiteButton } from "./Button";
import ResponsiveDiv from "./div/ResponsiveDiv";
import { OptionInput } from "./InputField";

export function Pagination(props: {
    size : number,
    setSize : Dispatch<SetStateAction<number>>,
    page : number,
    setPage : Dispatch<SetStateAction<number>>,
    totalPages : number,
    totalCount : number}) 
{
    const fixDisplayPageCount = 10;
    const startPage = useRef(1);
   
    const renderPageButton = (currentPage: number) : ReactNode => {
        if (props.totalCount == null || props.totalCount == 0) {
            return (<BorderlessButton style="bg-white" buttonName="No Data" clickHandler={() => {}} />);
        }

        if (currentPage >= startPage.current + fixDisplayPageCount - 1) {
            startPage.current = currentPage - fixDisplayPageCount + 2;
        } else if (currentPage <= startPage.current) {
            startPage.current = Math.max(1, currentPage - 1);
        }
        
        return [...Array(Math.min(fixDisplayPageCount, props.totalPages - startPage.current + 1))].map((_, index) => {
            const thisPage = startPage.current + index;
            let style = "bg-white"

            if (thisPage === currentPage) {
                style = "bg-black text-white"
            }

            return (
                <BorderlessButton style={style} buttonName={thisPage.toString()} key={thisPage} 
                    clickHandler={() => props.setPage(thisPage)} />
            )
        })
    };

    const jumpToPage = (toPage : number) => {
        if (toPage >= 1 && toPage <= props.totalPages) {
            props.setPage(toPage);
        }
    }

    return (
        <ResponsiveDiv style="p-3 mb-100 flex flex-row items-start justify-center bg-white gap-3" children={<>
            <WhiteButton buttonName="Previous" size="w-25 h-10" clickHandler={() => jumpToPage(props.page - 1)} />
            {renderPageButton(props.page)}
            <WhiteButton buttonName="Next" size="w-25 h-10" clickHandler={() => jumpToPage(props.page + 1)} />
            <OptionInput inputName="" inputValue={"5,10,20,50"} style="w-15" inputChangeHandler={(value) => props.setSize(parseInt(value))} />
            <BorderlessButton buttonName="/ PAGE" style="w-25 h-10" clickHandler={() => {}} />
        </>} />
    )
}

export default Pagination;