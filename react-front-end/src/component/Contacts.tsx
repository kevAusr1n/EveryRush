import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
import { isUserLoggedIn } from "../functions/UserUtils";
import { redirect } from "react-router";
import axios from "axios";

function Contacts() {
    const [contacts, setContacts] = useState<any>([]);

    const doDeleteContact = (contactId : string) : MouseEventHandler<HTMLButtonElement> => {
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

    const operationSection = () : ReactNode => {
        return (
            <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                    focus:outline-none focus:shadow-outline" onClick={() => redirect("addcontact")}>
                        ADD CONTACT
                </button>
            </div>
        )
    }

    const displayContact = () : ReactNode => {
        if (isUserLoggedIn()){
            return (
                <div>
                    {operationSection()}
                    <p>Please sign in to manage your contacts.</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                        focus:outline-none focus:shadow-outline" onClick={() => redirect("signin")}>
                            SIGN IN
                    </button>
                </div>
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
                <div>
                    {operationSection()}
                    <h1>Contacts</h1>
                    <p>Here are your contacts:</p>
                    {contacts.map((contact: any) => {
                        return (
                            <div>
                                <p>{contact.name}</p>
                                <p>{contact.address}</p>
                                <p>{contact.phone}</p>
                                <button onClick={doDeleteContact(contact.id)}>EDIT</button>
                                <button>DELETE</button>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }

    return (
        displayContact()
    )
}

export default Contacts;