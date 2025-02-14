import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router";
import FormTable from "./FormTable";
import { addOrUpdateContacts } from "../functions/ContactFunction";
import { FormEvent } from "react";

function AddOrUpdateContact() {
    const navigate = useNavigate();
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();
    
    return (
        <div>
            <FormTable
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
                actionHandler={(event: FormEvent<HTMLFormElement>) => {
                    addOrUpdateContacts({
                        action: action as string, 
                        id: searchParams.get("id") as string,
                        formSubmitEvent: event
                    });
                    navigate("/browse/contacts");
                }}
                backUrl="/browse/contacts"/>
        </div>
    )
    
}

export default AddOrUpdateContact;