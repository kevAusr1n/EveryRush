import { Dispatch, ReactNode, SetStateAction, useRef} from "react";
import { BasicButton, BorderlessButton } from "./Button";
import SelectionMenu from "./SelectionMemu";

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
    
    const changePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
            let color = "black"

            if (thisPage === currentPage) {
                color = "green-500"
            }

            return (
                <BorderlessButton color={color} buttonName={thisPage.toString()} key={thisPage} 
                    clickHandler={() => props.setPage(thisPage)} />
            )
        })
    };

    const jumpToPage = (toPage : number) => {
        if (toPage >= 1 && toPage <= props.totalPage) {
            props.setPage(toPage);
        }
    }

    return (
        <div className="flex justify-center items-center m-10">
            {props.page > 1 && <BorderlessButton color="black" buttonName="Previous" clickHandler={() => jumpToPage(props.page - 1)} />}
            {renderPageButton(props.page)}
            {props.page < props.totalPage && <BorderlessButton color="black" buttonName="Next" clickHandler={() => jumpToPage(props.page + 1)} />}   
            <SelectionMenu items={[5, 10, 20, 50]} inputChangeHandler={changePageSize} />
        </div>
    )
}

export default Pagination;