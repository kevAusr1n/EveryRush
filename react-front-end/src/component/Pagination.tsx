import { Dispatch, MutableRefObject, ReactNode, SetStateAction, useRef, useState } from "react";

export function Pagination(props: {
    size : number,
    setSize : Dispatch<SetStateAction<number>>,
    page : number,
    setPage : Dispatch<SetStateAction<number>>,
    totalPage : number,
    totalCount : number}) 
{
    const fixDisplayPageCount = 10;
    const startPage = useRef(1);
    
    const changeSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.setSize(Number(e.target.value));
    };

    const renderPageButton = (currentPage: number) : ReactNode => {

        if (currentPage >= startPage.current + fixDisplayPageCount - 1) {
            startPage.current = currentPage - fixDisplayPageCount + 2;
        } else if (currentPage <= startPage.current) {
            startPage.current = Math.max(1, currentPage - 1);
        }

        return [...Array(Math.min(fixDisplayPageCount, props.totalPage - startPage.current + 1))].map((_, index) => {
            const thisPage = startPage.current + index;
            let style = "border bg-white hover:bg-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline";

            if (thisPage === currentPage) {
                style = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2";
            }

            return (
                <button onClick={() => props.setPage(thisPage)} className={style}>
                    {thisPage}
                </button>
            )
        })
    };

    const jumpToPage = (toPage : number) => {
        if (toPage < 1) {
            alert("You're already at first Page.")
        }
        else if (toPage > props.totalPage) {
            alert("You're already at last Page.")
        }
        else {
            props.setPage(toPage);
        }
    }

    return (
        <div className="flex justify-center items-center m-10">
            <button onClick={() => jumpToPage(props.page - 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
            py-2 px-4 rounded-full mr-2">
                Previous
            </button>
            {renderPageButton(props.page)}
            <button onClick={() => jumpToPage(props.page + 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
            py-2 px-4 rounded-full mr-2">
                Next
            </button>       
            <select onInput={changeSize}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
    )
}

export default Pagination;