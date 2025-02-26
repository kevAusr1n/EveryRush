import { useEffect, useState } from "react";
import { isUserSignedIn } from "../functions/UserFunction";
import SignInRequiredPage from "./SignInRequiredPage";
import { getPaginatedContacts } from "../functions/ContactFunction";
import { Contact } from "../type/EntityType";
import { GetContactsResponse } from "../type/ResponseType";
import ContactDetailPage from "./ContactDetailPage";
import Pagination from "../components/Pagination";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { BlackButton } from "../components/Button";
import { useNavigate } from "react-router";


function ContactsPage() {
    const navigate = useNavigate();
    const [size, setSize]  = useState(5);
    const [page, setPage] = useState(1);
    const [refresh, setRefresh] = useState(false);
    const [response, setResponse] = useState<GetContactsResponse>({contacts: [], totalPages: 0, totalCount: 0});

    useEffect(() => {
        getPaginatedContacts({
            page: page, 
            size: size, 
            userid: localStorage.getItem("userid") as string,
            setResponse: setResponse
        })
    }, [page, size, refresh])

    return (   
        (!isUserSignedIn() && <SignInRequiredPage message="please sign in to manage contacts"/>) ||
        <ResponsiveDiv style="m-20 gap-5 flex flex-col items-center" children={[
            response.contacts.length == 0 && <ResponsiveDiv style="flex flex-col items-center gap-5" children={[
                <p key={crypto.randomUUID()} className="text-xl">Your have no contact</p>,
                <BlackButton key={crypto.randomUUID()} buttonName="ADD CONTACT" size="w-40 h-10" clickHandler={() => navigate("/contacts/add")} />
            ]} />,
            response.contacts.length != 0 && <ResponsiveDiv style="w-full flex flex-col items-start" children={[
                <ResponsiveDiv style="mb-5" children={[ 
                    <BlackButton key={crypto.randomUUID()} buttonName="ADD CONTACT" size="w-40 h-10" clickHandler={() => navigate("/contacts/add")} />,
                ]} />,
                response.contacts.map((contact: Contact) => {
                    return <ContactDetailPage 
                        key={crypto.randomUUID()} 
                        contact={contact} 
                        refresh={refresh}
                        setRefresh={setRefresh}
                    />
                })
            ]} />,
            response.contacts.length != 0 && <Pagination 
                size={size}
                setSize={setSize}
                page={page}
                setPage={setPage}
                totalPages={response.totalPages}
                totalCount={response.totalCount}
            />
        ]} />  
    )
}

export default ContactsPage;