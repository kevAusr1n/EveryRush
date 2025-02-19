import { Dispatch, ReactNode, SetStateAction, useRef, useState} from "react";
import { BorderlessButton } from "./Button";
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
    const sizeOptions: number[] = [5, 10, 20, 50, 100];
    const fixDisplayPageCount = 10;
    const startPage = useRef(1);
   
    const renderPageButton = (currentPage: number) : ReactNode => {
        if (props.totalCount == null || props.totalCount == 0) {
            return (<BorderlessButton buttonColor="white" textColor="black" buttonName="No Data" clickHandler={() => {}} />);
        }

        if (currentPage >= startPage.current + fixDisplayPageCount - 1) {
            startPage.current = currentPage - fixDisplayPageCount + 2;
        } else if (currentPage <= startPage.current) {
            startPage.current = Math.max(1, currentPage - 1);
        }
        
        return [...Array(Math.min(fixDisplayPageCount, props.totalPages - startPage.current + 1))].map((_, index) => {
            const thisPage = startPage.current + index;
            let color = "text-black"

            if (thisPage === currentPage) {
                color = "text-blue-500"
            }

            return (
                <BorderlessButton buttonColor="bg-white" textColor={color} buttonName={thisPage.toString()} key={thisPage} 
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
        <ResponsiveDiv style="p-5 flex flex-row justify-center bg-white" children={[
            props.page > 1 && <BorderlessButton buttonColor="blue-500" textColor="white" buttonName="Previous" clickHandler={() => jumpToPage(props.page - 1)} />,
            renderPageButton(props.page),
            props.page < props.totalPages && <BorderlessButton buttonColor="blue-500" textColor="white" buttonName="Next" clickHandler={() => jumpToPage(props.page + 1)} />,   
            <OptionInput inputName="/ Page" inputValue={"1,2,10,20,50"} style="right,w-20" inputChangeHandler={(value) => props.setSize(parseInt(value))} />
        ]} />
    )
}

export default Pagination;