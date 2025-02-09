import { ReactNode, useEffect, useState } from "react";
import { isUserLoggedIn } from "../functions/UserUtils";
import { Navigate, redirect, useNavigate } from "react-router";
import axios from "axios";

function Contacts() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<any>([]);

    const doDeleteContact = (contactId : string) => {
        axios
            .delete(`http://localhost:5175/api/contacts/${contactId}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((response) => {
                setContacts(response.data.contacts);
            })
            .catch((error) => {console.log(error);})
    }

    const doDisplayContactsIfThereIs = () : ReactNode => {
        if (contacts.length > 0){
            return (
                <>
                    <h1>Contacts</h1>
                    <p>Here are your contacts:</p>
                    {contacts.map((contact: any) => {
                        return (
                            <div>
                                <p>{contact.name}</p>
                                <p>{contact.address}</p>
                                <p>{contact.phone}</p>
                                <button onClick={() => doDeleteContact(contact.id)}>EDIT</button>
                                <button>DELETE</button>
                            </div>
                        )
                    })}
                </>
            )
        } else {
            return <p>There is no contact.</p>
        }
    }

    const doDisplayContactPage = () : ReactNode => {
        if (!isUserLoggedIn()){
            return (
                <>
                    <p>Please sign in to manage your contacts.</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                        focus:outline-none focus:shadow-outline" onClick={() => navigate("/signin")}>
                            SIGN IN
                    </button>
                </>
            )
        }
        else {
            useEffect(() => {
                axios
                .get(`http://localhost:5175/api/contacts?userid=${localStorage.getItem("userid")}`, {
                    headers: {
                        Accept: 'application/json'
                    }
                })
                .then((response) => {
                    setContacts(response.data.contacts);
                })
                .catch((error) => {console.log(error);})
            }, [contacts])

            return (
                <>
                    <div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                            focus:outline-none focus:shadow-outline" onClick={() => navigate("/add-contact")}>
                            ADD CONTACT
                         </button>
                    </div>
                    {doDisplayContactsIfThereIs()}
                </>
            )
        }
    }

    return (
        <div className="flex m-20 items-center justify-center">
            {doDisplayContactPage()}
        </div>
    )
}

export default Contacts;