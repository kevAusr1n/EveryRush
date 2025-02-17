import { ReactNode } from "react";
import FlexDiv from "./div/FlexDiv";
import BasicDiv from "./div/BasicDiv";

function MainContent(props: {children: ReactNode[], color: string}) {
    return (
        <BasicDiv color="white" children={<FlexDiv children={props.children} color={props.color}/>} />
    )
}

export default MainContent;