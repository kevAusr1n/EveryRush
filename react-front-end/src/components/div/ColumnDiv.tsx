import { ReactNode } from "react";

function ColumnDiv(props: {children: ReactNode, widthPercentage: string, color: string}) {
    return (
        <div className={"m-10 w-" + props.widthPercentage + " bg-" + props.color}>
            {props.children}
        </div>
  );
}

export default ColumnDiv;