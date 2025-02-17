import { ReactNode } from "react";

function FlexDiv(props: {children: ReactNode[], flexType: string, style: string}) {
    return (
        <div className={"flex " + props.flexType + " " + props.style}>
            {props.children}
        </div>
    );
}

export default FlexDiv;