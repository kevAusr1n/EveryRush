import { ReactNode, useState } from "react";

function DisplayArrangement(props: {
    arrangement: string,
    exhibitedChildren: ReactNode
})  {
    return (
        <div className={props.arrangement}>
            {props.exhibitedChildren}
        </div>
    )
}

export default DisplayArrangement;