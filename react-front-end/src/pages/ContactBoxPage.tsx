import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { MonoStyleText } from "../components/Text";
import { Contact } from "../type/EntityType";

function ContactBoxPage (props: { 
    id: string,
    contact: Contact, 
    style: string, 
    eventHandlerMap: { [key: string] : () => void } 
}) {
    return (
        <ResponsiveDiv id={props.id} style={props.style} eventHandlerMap={props.eventHandlerMap} children={<>
            <MonoStyleText style="text-2xl font-bold mb-5" content={props.contact.firstName + " " + props.contact.lastName} />
            <MonoStyleText style="" content={props.contact.email} />
            <MonoStyleText style="" content={props.contact.phone} />
            <MonoStyleText style="" content={props.contact.address} />
            <MonoStyleText style="" content={props.contact.city + ", " + props.contact.state + ", " + props.contact.postcode} />
        </>}/>
    )
}

export default ContactBoxPage;