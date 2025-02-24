import { createSearchParams, useNavigate } from "react-router";
import { BlackButton, RedButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { deleteContacts } from "../functions/ContactFunction";
import { Contact } from "../type/EntityType";
import { Dispatch, SetStateAction } from "react";

function ContactDetailPage(props: { 
    contact: Contact, 
    refresh: boolean,
    setRefresh: Dispatch<SetStateAction<boolean>> 
}) {
    const navigate = useNavigate();

    return (
        <ResponsiveDiv style="w-full p-5 flex flex-row justify-between shadow-xl" children={[
            <ResponsiveDiv style="h-30" children={[
                <strong>{props.contact.firstName + " " + props.contact.lastName}</strong>,
                <p>{props.contact.email}</p>,
                <p>{props.contact.phone}</p>,
                <p>{props.contact.address}</p>,
                <p>{props.contact.city + ", " + props.contact.state + ", " + props.contact.postcode}</p>
            ]} />,
            <ResponsiveDiv style="flex flex-col items-center justify-center gap-5" children={[
                <BlackButton buttonName="Edit" size="w-40 h-10" clickHandler={() => {
                    navigate({
                        pathname: "/contacts/edit/",
                        search: createSearchParams({
                            id: props.contact.id,
                            firstname: props.contact.firstName,
                            lastname: props.contact.lastName,
                            email: props.contact.email,
                            phone: props.contact.phone,
                            address: props.contact.address,
                            city: props.contact.city,
                            state: props.contact.state,
                            postcode: props.contact.postcode
                        }).toString()
                    });
                }} />,
                <RedButton buttonName="Delete" size="w-40 h-10" clickHandler={() => {
                    deleteContacts({id : props.contact.id});
                    props.setRefresh(!props.refresh);
                }} />,
            ]}/>
        ]}/>
    )
}

export default ContactDetailPage;