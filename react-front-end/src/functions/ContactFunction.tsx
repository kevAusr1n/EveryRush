import axios from "axios";
import { Dispatch, FormEvent, SetStateAction } from "react"
import { GetContactsResponse } from "../type/ResponseType";

async function getPaginatedContacts (props: {
    page: number,
    size: number,
    userid: string
    setResponse: Dispatch<SetStateAction<GetContactsResponse>>
}) {
    await axios.get(`http://localhost:5175/api/contacts?userid=${props.userid}&page=${props.page}&size=${props.size}`, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((response) => {
        props.setResponse(response.data);
    })
    .catch((error) => {console.log(error);})
}

async function addOrUpdateContacts (props: {
    action : string,
    id: string,
    formSubmitEvent: FormEvent<HTMLFormElement>
}) : Promise<boolean> {
    props.formSubmitEvent.preventDefault();
    const formData = new FormData(props.formSubmitEvent.currentTarget);
    let isSucceed : boolean = false;

    var requestBody = {
        id: props.id,
        userId: localStorage.getItem('userid'),
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        postcode: formData.get('postcode'),
    }

    await axios.post(`http://localhost:5175/api/contacts/${props.action}`, requestBody, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((_) => isSucceed = true)
    .catch((error) => console.log(error))

    return isSucceed;
}

function deleteContacts (props: {id: string}) {
    axios.delete(`http://localhost:5175/api/contacts?id=${props.id}`, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((_) => {})
    .catch((error) => {console.log(error);})
}

export { getPaginatedContacts, addOrUpdateContacts, deleteContacts };