import { useEffect, useState } from "react";
import { isUserSignedIn } from "../functions/UserFunction";
import SignInRequiredPage from "./SignInRequiredPage";
import { getPaginatedContacts } from "../functions/ContactFunction";
import { Contact } from "../type/EntityType";
import { GetContactsResponse } from "../type/ResponseType";
import ContactDetailPage from "./ContactDetailPage";
import Pagination from "../components/Pagination";
import ResponsiveDiv from "../components/div/ResponsiveDiv";


function ContactsPage() {
    const [size, setSize]  = useState(5);
    const [page, setPage] = useState(1);
    const [response, setResponse] = useState<GetContactsResponse>({contacts: [], totalPages: 0, totalCount: 0});

    useEffect(() => {
        getPaginatedContacts({
            page: 1, 
            size: 10, 
            userid: localStorage.getItem("userid") as string,
            setResponse: setResponse
        })
    }, [])

    return (   
        (!isUserSignedIn() && <SignInRequiredPage message="contacts"/>) ||
        (isUserSignedIn() && 
            <ResponsiveDiv style="flex flex-col items-center" children={[
                <ResponsiveDiv style="mt-20 mb-10 gap-5 flex flex-col items-center" children={[
                    response.contacts.map((contact: Contact) => {
                        return <ContactDetailPage key={crypto.randomUUID()} contact={contact} />
                    })
                ]} />,
                <Pagination 
                    size={size}
                    setSize={setSize}
                    page={page}
                    setPage={setPage}
                    totalPages={response.totalPages}
                    totalCount={response.totalCount}
                />
            ]} />
        )
    )
}

export default ContactsPage;