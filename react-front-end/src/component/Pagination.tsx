import { ReactNode, useRef, useState } from "react";

export function Pagination(props: {totalCount : number}) {
    const fixDisplayPageCount = 10;
    
    const startPage = useRef(1);
    const [size, setSize]  = useState(10);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(Math.ceil(props.totalCount / size));

    const changeSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSize(Number(e.target.value))
        setTotalPage(Math.ceil(props.totalCount / Number(e.target.value)))
    };

    const renderPageButton = (currentPage: number) : ReactNode => {

        if (currentPage >= startPage.current + fixDisplayPageCount - 1) {
            startPage.current = currentPage - fixDisplayPageCount + 2;
        } else if (currentPage <= startPage.current) {
            startPage.current = Math.max(1, currentPage - 1);
        }

        return [...Array(Math.min(fixDisplayPageCount, totalPage - startPage.current + 1))].map((_, index) => {
            const thisPage = startPage.current + index;
            let style = "border bg-white hover:bg-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline";

            if (thisPage === currentPage) {
                style = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2";
            }

            return (
                <button onClick={() => setPage(thisPage)} className={style}>
                    {thisPage}
                </button>
            )
        })
    };

    const jumpToPage = (page: number) => {
        if (page < 1 || page > totalPage) {
            return;
        }
        setPage(page);
    }

    return (
        <div className="flex justify-center items-center">
            <button onClick={() => setPage(page - 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
            py-2 px-4 rounded-full mr-2">
                Previous
            </button>
            {renderPageButton(page)}
            <button onClick={() => setPage(page + 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
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