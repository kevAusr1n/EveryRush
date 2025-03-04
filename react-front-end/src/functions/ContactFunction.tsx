import { FormEvent } from "react"
import { GetContactsResponse } from "../type/ResponseType";
import APICall from "../config/ApiConfig";

async function getPaginatedContacts (props: {
    page: number,
    size: number,
    userid: string
}) : Promise<GetContactsResponse> {
    var getContactsResponse = {} as GetContactsResponse;
    await APICall().get(`/api/contacts?userid=${props.userid}&page=${props.page}&size=${props.size}`)
    .then((response) => {
        getContactsResponse = response.data;
    })
    .catch((error) => {console.log(error);})

    return getContactsResponse;
}

async function addOrUpdateContacts (props: {
    action : string,
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    postcode: string
}) : Promise<boolean> {
    let isSucceed : boolean = false;

    var requestBody = {
        id: props.id,
        userId: localStorage.getItem('userid'),
        firstName: props.firstName,
        lastName: props.firstName,
        email: props.email,
        phone: props.phone,
        address: props.address,
        city: props.city,
        state: props.state,
        postcode: props.postcode,
    }

    await APICall().post(`/api/contacts/${props.action}`, requestBody, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((_) => isSucceed = true)
    .catch((error) => console.log(error))

    return isSucceed;
}

async function deleteContacts (props: {id: string}) {
    await APICall().delete(`/api/contacts/delete/${props.id}`, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((_) => {})
    .catch((error) => {console.log(error);})
}

export { getPaginatedContacts, addOrUpdateContacts, deleteContacts };