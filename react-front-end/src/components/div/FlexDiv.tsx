import { ReactNode } from "react";

function FlexDiv(props: {children: ReactNode[], color: string}) {
    return (
        <div className={"flex bg-" + props.color}>
            {props.children}
        </div>
    );
}

export default FlexDiv;