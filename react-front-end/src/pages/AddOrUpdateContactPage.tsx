import { useNavigate, useParams, useSearchParams } from "react-router";
import { addOrUpdateContacts } from "../functions/ContactFunction";
import { FormEvent } from "react";
import SubmitForm from "../components/SubmitForm";
import ResponsiveDiv from "../components/div/ResponsiveDiv";

function AddOrUpdateContactPage() {
    const navigate = useNavigate();
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();
    
    return (
        <ResponsiveDiv style="flex flex-col items-center" children={[
            <ResponsiveDiv style="mt-20 mb-20 gap-5 p-20 flex flex-col items-center bg-white shadow" children={[
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
                />
            ]} />
        ]} />
    )
    
}

export default AddOrUpdateContactPage;