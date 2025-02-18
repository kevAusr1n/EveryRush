import { useState } from "react";
import { CartItem, Product } from "../type/EntityType";
import ResponsiveDiv from "./div/ResponsiveDiv";

function CountEditor(props: {
    initial_count: number, 
    target: CartItem | Product,
    countChangeHandler: (...params: any) => boolean
}) {
    const id = crypto.randomUUID();
    const [count, setCount] = useState(props.initial_count);
    
    const validateInputIsIntegerThenChage = (newCount : number) => {
        if (!Number.isInteger(newCount) || newCount <= 0) {
            return;
        }
 
        switch(props.target) {
            case props.target as CartItem:
                props.countChangeHandler({item: props.target, quantity: newCount - count});
                break;
            default:
                break;
        }

        document.getElementById(id)?.setAttribute("innterHTML", newCount.toString());
        setCount(newCount);
    }

    return (
        <ResponsiveDiv key={crypto.randomUUID()} style="flex flex-row items-center justify-center gap-2" children={[ 
            <button key={crypto.randomUUID()} className="w-5 bg-gray-200 border-1" onClick={() => validateInputIsIntegerThenChage(count - 1)}>-</button>,
            <input key={crypto.randomUUID()} id = {id} className="w-10 border-1" value={count} onChange={(e) => validateInputIsIntegerThenChage(Number(e.target.value))} />,
            <button key={crypto.randomUUID()} className="w-5 bg-gray-200 border-1" onClick={() => validateInputIsIntegerThenChage(count + 1)}>+</button>
        ]} />
    );
}

export default CountEditor;