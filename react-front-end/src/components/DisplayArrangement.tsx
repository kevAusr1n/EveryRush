import { ReactNode } from "react";
import ResponsiveDiv from "./div/ResponsiveDiv";

function DisplayArrangement(props: {
    arrangement: string,
    exhibitedChildren: ReactNode
})  {
    return (
        <ResponsiveDiv style={"w-full " + props.arrangement} children={[
            props.exhibitedChildren
        ]} />
    )
}

export default DisplayArrangement;