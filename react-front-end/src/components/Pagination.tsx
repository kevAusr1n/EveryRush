import { Dispatch, ReactNode, SetStateAction, useRef} from "react";
import { BorderlessButton } from "./Button";
import SelectionMenu from "./SelectionMemu";
import ResponsiveDiv from "./div/ResponsiveDiv";

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
    
    const changePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.setSize(Number(e.target.value));
    };

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
            let color = "black"

            if (thisPage === currentPage) {
                color = "blue-500"
            }

            return (
                <BorderlessButton buttonColor="white" textColor={color} buttonName={thisPage.toString()} key={thisPage} 
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
        <ResponsiveDiv style="flex flex-row justify-center gap-5" children={[
            props.page > 1 && <BorderlessButton buttonColor="blue-500" textColor="white" buttonName="Previous" clickHandler={() => jumpToPage(props.page - 1)} />,
            renderPageButton(props.page),
            props.page < props.totalPages && <BorderlessButton buttonColor="blue-500" textColor="white" buttonName="Next" clickHandler={() => jumpToPage(props.page + 1)} />,   
            <SelectionMenu default_value={props.size} values={sizeOptions} valueChangeHandler={changePageSize} />
        ]} />
    )
}

export default Pagination;