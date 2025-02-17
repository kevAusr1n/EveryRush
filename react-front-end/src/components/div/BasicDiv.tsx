import { ReactNode } from "react";

function BasicDiv(props: {children: ReactNode[], style: string}) {
    return (
        <div className={"mb-10 " + props.style}>
            {props.children}
        </div>
    );
}

export default BasicDiv;