import { ReactNode } from "react";

function ResponsiveDiv(props: {
    children: ReactNode, 
    style: string, 
    eventHandlerMap: any
}) {
    return (
        <div className={props.style} {...props.eventHandlerMap}>
            {props.children}
        </div>
    );
}

export default ResponsiveDiv;