import { Dispatch, SetStateAction, useState } from "react";

function CountEditor(props: {
    initial_count: number, 
}) {
    const id = crypto.randomUUID();
    const [count, setCount] = useState(props.initial_count);
    // const [errorMsg, setErrorMsg] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const validateInputIsIntegerThenChage = (count : number) => {
        if (Number.isInteger(count)) {
            document.getElementById(id)?.setAttribute("innterHTML", count.toString());
            setCount(count);
            setErrorMsg("");
        } else {
            setErrorMsg("Count is not integer");
        }
    }

    return (
        <div> 
            <button className="w-10" onClick={() => validateInputIsIntegerThenChage(count + 1)}>+</button>
            <input id = {id} className="w-10" value={count} onChange={(e) => validateInputIsIntegerThenChage(Number(e.target.value))} />
            <button className="w-10" onClick={() => validateInputIsIntegerThenChage(count - 1)}>-</button>
            <p className="text-red-500">{errorMsg}</p>
        </div>
    );
}

export default CountEditor;