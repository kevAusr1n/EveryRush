import { ReactNode } from "react";
import { isUserLoggedIn } from "../functions/UserUtils";
import { redirect } from "react-router";

function Contacts() {
    const displayContact = () : ReactNode => {
        if (isUserLoggedIn()){
            return (
                <div>
                    <p>Please sign in to manage your contacts.</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                        focus:outline-none focus:shadow-outline" onClick={() => redirect("signin")}>
                            SIGN IN
                    </button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h1>Contacts</h1>
                    <p>Here are your contacts:</p>
                    <ul>
                        <li>John Doe</li>
                        <li>Jane Smith</li>
                        <li>Bob Johnson</li>
                    </ul>
                </div>
            )
        }
    }

    return (
        {displayContact()}
    )
}

export default Contacts;