import { useNavigate, useParams, useSearchParams } from "react-router";
import { addOrUpdateContacts } from "../functions/ContactFunction";
import { FormEvent } from "react";
import SubmitForm from "../components/SubmitForm";

function AddOrUpdateContactPage() {
    const navigate = useNavigate();
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();
    
    return (
        <div>
            <SubmitForm
                inputNames={["FirstName", "LastName", "Email", "Phone", "Address", "City", "State", "Postcode"]}
                inputTypes={["text", "text", "text", "text", "text", "text", "text", "text"]}
                inputValues={[
                    searchParams.get("firstname") as string, 
                    searchParams.get("lastname") as string, 
                    searchParams.get("email") as string, 
                    searchParams.get("phone") as string, 
                    searchParams.get("address") as string, 
                    searchParams.get("city") as string, 
                    searchParams.get("state") as string, 
                    searchParams.get("postcode") as string, 
                ]}
                actionName={action as string}
                actionHandler={async (event: FormEvent<HTMLFormElement>) => {
                    if (await addOrUpdateContacts({
                        action: action as string, 
                        id: searchParams.get("id") as string,
                        formSubmitEvent: event
                    })) {
                        navigate("/index/contacts");
                    }
                }}
                style="w-200"
                backUrl="/index/contacts"/>
        </div>
    )
    
}

export default AddOrUpdateContactPage;