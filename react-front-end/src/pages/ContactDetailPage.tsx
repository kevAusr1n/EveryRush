import { createSearchParams, useNavigate } from "react-router";
import { RedButton, WhiteButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { deleteContacts } from "../functions/ContactFunction";
import { Contact } from "../type/ObjectType";
import { Dispatch, SetStateAction } from "react";
import { MonoStyleText } from "../components/Text";

function ContactDetailPage(props: { 
    contact: Contact, 
    refresh: boolean,
    setRefresh: Dispatch<SetStateAction<boolean>> 
}) {
    const navigate = useNavigate();
    const deleteContactsHandler = async (id: string) => {
        await deleteContacts({id : id});
        props.setRefresh(!props.refresh);
    }

    return (
        <ResponsiveDiv style="w-full p-5 flex flex-row justify-between shadow-xl mb-5" children={<>
            <ResponsiveDiv style="" children={<>
                <MonoStyleText style="text-2xl font-bold mb-5" content={props.contact.firstName + " " + props.contact.lastName} />
                <MonoStyleText style="" content={props.contact.email} />
                <MonoStyleText style="" content={props.contact.phone} />
                <MonoStyleText style="" content={props.contact.address} />
                <MonoStyleText style="" content={props.contact.city + ", " + props.contact.state + ", " + props.contact.postcode} />
            </>} />
            <ResponsiveDiv style="w-1/6 flex flex-col items-center justify-center gap-5" children={<>
                <WhiteButton buttonName="Edit" size="w-full h-10" clickHandler={() => {
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
                }} />
                <RedButton buttonName="Delete" size="w-full h-10" clickHandler={() => {
                    deleteContactsHandler(props.contact.id);
                }} />
            </>}/>
        </>}/>
    )
}

export default ContactDetailPage;