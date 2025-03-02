import { Dispatch, SetStateAction, useRef } from "react";
import ResponsiveDiv from "./div/ResponsiveDiv";
import { ArrowLeft, ArrowRight } from "lucide-react";

function ImageBrief (props: {
    id?: string,
    src: string,
    style: string,
    eventHandlerMap?: { [key: string] : () => void }
}) {
    return (
        <img id={props.id != undefined ? props.id : crypto.randomUUID()} src={props.src} alt="Image Missed or Broken" className={props.style} {...props.eventHandlerMap} />
    )
}

function ImageExhibition (props: {
    srcList: string[],
    style: string,
    currentImageIndex: number,
    setCurrentImageIndex: Dispatch<SetStateAction<number>>,
    eventHandlerMap: (...params : any) => { [key : string] : () => void}
}) {
    const imageWindowSize = 5;
    const startImageIndex = useRef(0);
    const displayWindow = (toImageIndex: number) => {
        if (toImageIndex >= 0 && toImageIndex < props.srcList.length) {
            if (toImageIndex > startImageIndex.current + imageWindowSize - 1) {
                startImageIndex.current = startImageIndex.current + 1;
            } else if (toImageIndex < startImageIndex.current) {
                startImageIndex.current = startImageIndex.current - 1;
            }
            props.setCurrentImageIndex(toImageIndex);
        }
    }

    return (
        <ResponsiveDiv style="flex flex-row gap-5 items-center" children={<>
            <button id={crypto.randomUUID()} key={crypto.randomUUID()} onClick={() => displayWindow(props.currentImageIndex - 1)}>
                <ArrowLeft />
            </button>
            {props.srcList.map((src: string, index: number) => {
                if (index >= startImageIndex.current && index <= startImageIndex.current + imageWindowSize - 1) {
                    let style = props.currentImageIndex == index ? props.style + " border-2 border-black" : props.style;
                    return <ImageBrief key={index} src={src} style={style} eventHandlerMap={props.eventHandlerMap(index)} />
                } else {
                    return <></>;
                }
            })}
            <button id={crypto.randomUUID()} key={crypto.randomUUID()} onClick={() => displayWindow(props.currentImageIndex + 1)}>
                <ArrowRight />
            </button>
        </>} />
    )
}

export { ImageBrief, ImageExhibition };