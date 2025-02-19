import { BasicButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { Contact } from "../type/EntityType";

function ContactDetailPage(props: { contact: Contact }) {
    return (
        <ResponsiveDiv style="p-5 flex flex-row justify-between bg-white gap-40 shadow" children={[
            <ResponsiveDiv style="w-100 h-30" children={[
                <strong>{props.contact.firstName + " " + props.contact.lastName}</strong>,
                <p>{props.contact.email}</p>,
                <p>{props.contact.phone}</p>,
                <p>{props.contact.address}</p>,
                <p>{props.contact.city + ", " + props.contact.state + ", " + props.contact.postcode}</p>
            ]} />,
            <ResponsiveDiv style="flex flex-col items-center justify-center gap-5" children={[
                <BasicButton buttonColor="bg-blue-500" textColor="text-white" buttonName="Edit" clickHandler={() => {}} />,
                <BasicButton buttonColor="bg-red-500" textColor="text-white" buttonName="Delete" clickHandler={() => {}} />,
            ]}/>
        ]}/>
    )
}

export default ContactDetailPage;