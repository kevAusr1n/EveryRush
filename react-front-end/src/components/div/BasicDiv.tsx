import { ReactNode } from "react";

function BasicDiv(props: {children: ReactNode, color: string}) {
    return (
        <div className={"mb-10 bg-" + props.color}>
            {props.children}
        </div>
    );
}

export default BasicDiv;