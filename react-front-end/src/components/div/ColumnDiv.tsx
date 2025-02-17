import { ReactNode } from "react";

function ColumnDiv(props: {children: ReactNode, widthPercentage: string, style: string}) {
    return (
        <div className={"m-10 w-" + props.widthPercentage + " " + props.style}>
            {props.children}
        </div>
  );
}

export default ColumnDiv;