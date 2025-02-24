import { Dispatch, FormEvent, SetStateAction } from "react"
import { GetContactsResponse } from "../type/ResponseType";
import APICall from "../config/ApiConfig";

async function getPaginatedContacts (props: {
    page: number,
    size: number,
    userid: string
    setResponse: Dispatch<SetStateAction<GetContactsResponse>>
}) {
    await APICall().get(`/api/contacts?userid=${props.userid}&page=${props.page}&size=${props.size}`)
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

    alert(JSON.stringify(requestBody));
    await APICall().post(`/api/contacts/${props.action}`, requestBody, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((_) => isSucceed = true)
    .catch((error) => console.log(error))

    return isSucceed;
}

function deleteContacts (props: {id: string}) {
    APICall().delete(`/api/contacts?id=${props.id}`, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((_) => {})
    .catch((error) => {console.log(error);})
}

export { getPaginatedContacts, addOrUpdateContacts, deleteContacts };