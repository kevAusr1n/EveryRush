import { ReactNode } from "react";

function ResponsiveDiv(props: {
    id?: string
    children: ReactNode, 
    style: string, 
    eventHandlerMap?: { [key: string] : () => void }
}) {
    return (
        <div id={props.id != undefined ? props.id : crypto.randomUUID()} className={props.style} {...props.eventHandlerMap}>
            {props.children}
        </div>
    );
}

export default ResponsiveDiv;