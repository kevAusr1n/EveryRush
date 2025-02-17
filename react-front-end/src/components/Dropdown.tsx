import ContactBoxPage from "../pages/ContactBoxPage";
import { Contact, Product } from "../type/EntityType";
import FlexDiv from "./div/FlexDiv";

function ContactBoxDropDown(props: {
    isDropDown: boolean
    items: Contact[],
    eventHandlerMap: (...params : any) => { [key : string] : () => void}
}) {
    return (
        props.isDropDown && <FlexDiv flexType="flex-col" style="absolute bg-white border rounded-lg" children={[
            props.items.map((contact: Contact) => {
                const id = crypto.randomUUID();
                const originStyle = "flex flex-col w-150 bg-white";
                return <ContactBoxPage id={id} style={originStyle} contact={contact} eventHandlerMap={props.eventHandlerMap(id, originStyle, contact)} />
            })
        ]}/>
           
    )
}

function DropDown (props: {
    isDropDown: boolean
    items: Contact[] | Product[],
    eventHandlerMap?: (...params : any) => { [key : string] : () => void}
}) {    
    switch(props.items) {
        case props.items as Contact[]:
            return <ContactBoxDropDown isDropDown={props.isDropDown} items={props.items as Contact[]} eventHandlerMap={props.eventHandlerMap as (...params : any) => { [key : string] : () => void}} />
        default:
            return <></>
    }
}

export default DropDown;