import ContactBoxPage from "../pages/ContactBoxPage";
import { Contact, Product } from "../type/EntityType";
import ResponsiveDiv from "./div/ResponsiveDiv";

function ContactBoxDropDown(props: {
    dropDown: boolean
    items: Contact[],
    eventHandlerMap: (...params : any) => { [key : string] : () => void}
}) {
    return (
        props.dropDown && <ResponsiveDiv style="absolute bg-white border" children={[
            props.items.map((contact: Contact) => {
                const id = crypto.randomUUID();
                const originStyle = "flex flex-col w-100 bg-white border p-5";
                return <ContactBoxPage id={id} style={originStyle} contact={contact} eventHandlerMap={props.eventHandlerMap(id, originStyle, contact)} />
            })
        ]}/>      
    )
}

function StringBoxDropDown(props: {
    dropDown: boolean
    items: string[],
    eventHandlerMap: (...params : any) => { [key : string] : () => void}
}) {
    return (
        props.dropDown && <ResponsiveDiv style="absolute bg-white border" children={[
            props.items.map((item: string, index: number) => {
                const id = crypto.randomUUID();
                const originStyle = "flex flex-col w-100 bg-white border p-5";
                return <ResponsiveDiv id={id} key={index} style={originStyle} eventHandlerMap={props.eventHandlerMap(id, originStyle, item)} children={[
                    <p>{item}</p>
                ]} />
            })
        ]} />
    )
}

function DropDown (props: {
    dropDown: boolean
    items: Contact[] | Product[] | string [],
    eventHandlerMap?: (...params : any) => { [key : string] : () => void}
}) {    
    switch(typeof props.items[0]) {
        case "object":
            return <ContactBoxDropDown dropDown={props.dropDown} items={props.items as Contact[]} eventHandlerMap={props.eventHandlerMap as (...params : any) => { [key : string] : () => void}} />
        case "string":
            return <StringBoxDropDown dropDown={props.dropDown} items={props.items as string[]} eventHandlerMap={props.eventHandlerMap as (...params : any) => { [key : string] : () => void}} />
        default:
            return <></>
    }
}

export default DropDown;