import axios from "axios";
import { Dispatch, FormEvent, SetStateAction } from "react"
import { useNavigate } from "react-router";

function getPaginatedContacts (props: {
    page: number,
    size: number,
    userid: string
    setContacts: Dispatch<SetStateAction<any[]>>
}) {
    axios.get(`http://localhost:5175/api/contacts?userid=${props.userid}&page=${props.page}&size=${props.size}`, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((response) => {
        props.setContacts(response.data.contacts);
    })
    .catch((error) => {console.log(error);})
}

function addOrUpdateContacts (props: {
    action : string,
    id: string,
    formSubmitEvent: FormEvent<HTMLFormElement>
}) {
    props.formSubmitEvent.preventDefault();
    const formData = new FormData(props.formSubmitEvent.currentTarget);

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

    axios.post(`http://localhost:5175/api/contacts/${props.action}`, requestBody, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((_) => {})
    .catch((error) => {console.log(error);})
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