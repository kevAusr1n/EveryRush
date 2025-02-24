import { useState } from "react";
import { CartItem } from "../type/EntityType";
import ResponsiveDiv from "./div/ResponsiveDiv";
import { isStringEmpty } from "../functions/Utils";

function CountEditor(props: {
    initial_count: number, 
    target: CartItem,
    countChangeHandler: (...params: any) => any
}) {
    const id = crypto.randomUUID();
    const [count, setCount] = useState(props.initial_count);
    
    const validateInputIsIntegerThenChage = (newCount : number) => {
        if (!Number.isInteger(newCount) || newCount <= 0) {
            return;
        }

        props.target.quantity = newCount;
        props.countChangeHandler({item: props.target})  
        document.getElementById(id)?.setAttribute("innterHTML", newCount.toString());
        setCount(newCount);
    }

    return (
        <ResponsiveDiv key={crypto.randomUUID()} style="flex flex-row items-center justify-center gap-2" children={[ 
            <button key={crypto.randomUUID()} className="w-5 bg-gray-200 border-1" onClick={() => validateInputIsIntegerThenChage(count - 1)}>-</button>,
            <input key={crypto.randomUUID()} id = {id} className="w-10 border-1" value={count} readOnly />,
            <button key={crypto.randomUUID()} className="w-5 bg-gray-200 border-1" onClick={() => validateInputIsIntegerThenChage(count + 1)}>+</button>
        ]} />
    );
}

export default CountEditor;