import { useState } from "react";
import { CartItem } from "../type/ObjectType";
import ResponsiveDiv from "./div/ResponsiveDiv";
import { RedButton, WhiteButton } from "./Button";
import { isNonNegativeInteger, isStringEmpty } from "../functions/Utils";

function CountEditor(props: {
    initial_count: number, 
    target: CartItem,
    countChangeHandler: (...params: any) => any
}) {
    const readOnlyStyle = "w-15 h-10 border-1 bg-gray-200 focus:outline-none";
    const editableStyle = "w-15 h-10 border-1 bg-white focus:outline-none";

    const [count, setCount] = useState(props.initial_count.toString());
    const [readOnly, setReadOnly] = useState(true);
    const [quantityInputStyle, setQuantityInputStyle] = useState(readOnlyStyle);

    const validateInputIsIntegerThenChange = (newCount : string) : boolean => {
        if (!isNonNegativeInteger(newCount) || Number.parseInt(newCount) > 999) {
            return false;
        }

        props.target.quantity = Number.parseInt(newCount);
        props.countChangeHandler(props.target);
        return true;
    }

    return (
        <ResponsiveDiv style="flex flex-row items-center justify-center gap-2" children={<> 
            <input className={quantityInputStyle} 
                value={count} 
                onChange={(e) => setCount(e.target.value)} 
                readOnly={readOnly}
            />
            {readOnly && <WhiteButton buttonName="EDIT" size="w-25 h-10" clickHandler={() => {
                setReadOnly(false);
                setQuantityInputStyle(editableStyle);
            }} />}
            {!readOnly && <WhiteButton buttonName="Y" size="w-10 h-10" clickHandler={() => {
                if (validateInputIsIntegerThenChange(count)) {
                    setReadOnly(true);
                    setQuantityInputStyle(readOnlyStyle);
                }
            }} />}
            {!readOnly && <RedButton buttonName="N" size="w-10 h-10" clickHandler={() => {
                setCount(props.initial_count.toString());
                setReadOnly(true);
                setQuantityInputStyle(readOnlyStyle);
            }} />}
        </>} />
    );
}

export default CountEditor;