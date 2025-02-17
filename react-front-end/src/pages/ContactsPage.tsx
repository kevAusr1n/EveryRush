import { useEffect, useState } from "react";
import { isUserSignedIn } from "../functions/UserFunction";
import BasicDiv from "../components/div/BasicDiv";
import FlexDiv from "../components/div/FlexDiv";
import SignInRequiredPage from "./SignInRequiredPage";
import { getPaginatedContacts } from "../functions/ContactFunction";
import { Contact } from "../type/EntityType";
import { GetContactsResponse } from "../type/ResponseType";
import ContactDetailPage from "./ContactDetailPage";
import Pagination from "../components/Pagination";


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
            <>
                <BasicDiv style="bg-gray-500 p-20" children={
                    response.contacts.map((contact: Contact) => {
                        return <ContactDetailPage key={crypto.randomUUID()} contact={contact} />
                    })}/>
                <Pagination 
                    size={size}
                    setSize={setSize}
                    page={page}
                    setPage={setPage}
                    totalPages={response.totalPages}
                    totalCount={response.totalCount}
                />
            </>
        )
    )
}

export default ContactsPage;