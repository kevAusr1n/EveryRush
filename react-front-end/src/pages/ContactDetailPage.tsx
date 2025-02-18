import { BasicButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { Contact } from "../type/EntityType";

function ContactDetailPage(props: { contact: Contact }) {
    return (
        <ResponsiveDiv style="flex flex-col m-5 bg-white border- 1flex flex-col gap-1 shadow w-1/2 p-5 rounded-lg" children={[
            <strong>{props.contact.firstName + " " + props.contact.lastName}</strong>,
            <p>{props.contact.email}</p>,
            <p>{props.contact.phone}</p>,
            <p>{props.contact.address}</p>,
            <p>{props.contact.city + ", " + props.contact.state + ", " + props.contact.postcode}</p>,
            <ResponsiveDiv style="flex flex-col" children={[
                <BasicButton buttonColor="blue-500" textColor="white" buttonName="Edit" clickHandler={() => {}} />,
                <BasicButton buttonColor="red-500" textColor="white" buttonName="Delete" clickHandler={() => {}} />,
            ]}/>
        ]}/>
    )
}

export default ContactDetailPage;