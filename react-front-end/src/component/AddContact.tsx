import axios from "axios";
import Contacts from "./Contacts";
import { redirect } from "react-router";

function Addcontact() {
    const doAddContact = (formData : FormData) => {
        var requestBody = {
            ownerId: localStorage.getItem("user"),
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            postcode: formData.get('postcode'),
        }

        axios
            .post(`http://localhost:5175/api/contacts/add`, {
                headers: {
                    Accept: 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
            .then((_) => {
                redirect("/contacts");
            })
            .catch((error) => {console.log(error);})
    }

    const doBackToContact = () => {
        redirect("/contacts");
    }

    return (
        <div>
            <button>ADD</button>
            <button>ADD</button>
        </div>
    )
    
}

export default Addcontact;