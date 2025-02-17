import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { Contact } from "../type/EntityType";

function ContactBoxPage (props: { 
    id: string,
    contact: Contact, 
    style: string, 
    eventHandlerMap: { [key: string] : () => void } 
}) {
    return (
        <ResponsiveDiv id={props.id} style={props.style} eventHandlerMap={props.eventHandlerMap} children={[
            <strong>{props.contact.firstName + " " + props.contact.lastName}</strong>,
            <p>{props.contact.email}</p>,
            <p>{props.contact.phone}</p>,
            <p>{props.contact.address}</p>,
            <p>{props.contact.city + ", " + props.contact.state + ", " + props.contact.postcode}</p>,
        ]}/>
    )
}

export default ContactBoxPage;