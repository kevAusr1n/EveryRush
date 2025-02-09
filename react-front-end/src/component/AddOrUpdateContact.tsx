import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router";
import FormTable from "./FormTable";

function AddOrUpdateContact() {
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();
    
    const navigate = useNavigate();

    const doAddOrUpdateContact = (formData : FormData) => {
        var requestBody = {
            id: searchParams.get("id") as string,
            ownerId: localStorage.getItem('userid'),
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            postcode: formData.get('postcode'),
        }

        alert(JSON.stringify(requestBody));

        axios
            .post(`http://localhost:5175/api/contacts/${action}`, requestBody, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((_) => {
                navigate("/contacts");
            })
            .catch((error) => {console.log(error);})
    }

    const doBackToContact = () => {
        navigate("/contacts");
    }

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
                actionHandler={doAddOrUpdateContact}/>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                focus:outline-none focus:shadow-outline" onClick={() => navigate("/contacts")}>
                    Back
                </button>
        </div>
    )
    
}

export default AddOrUpdateContact;