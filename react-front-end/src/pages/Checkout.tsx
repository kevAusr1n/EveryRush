import { ReactNode, useEffect, useRef, useState } from "react"
import { BasicButton } from "../components/Button";
import DropDown from "../components/Dropdown";
import InputField from "../components/InputField";
import { GetContactsResponse } from "../type/ResponseType";
import { getPaginatedContacts } from "../functions/ContactFunction";
import { Contact } from "../type/EntityType";

function Checkout() {
    const [dropdown, setDropdown] = useState(false);
    const [contactResponse, setContactResponse] = useState<GetContactsResponse>({contacts: [], totalPages: 0, totalCount: 0});

    const displayProducts = () : ReactNode => {
        let productsInCart = sessionStorage.getItem("cart");
        let productsInCartJson = JSON.parse(productsInCart as string);

        return productsInCartJson.cartItems.map((product: any) => {
            return (             
                <tr className="border-b border-gray-400">
                    <th><img src=""/></th>
                    <th>{product.name}</th>
                    <th>{product.quantity}</th>
                    <th>{product.price}</th>
                </tr>
            )
        })
    }

    useEffect(() => {
        getPaginatedContacts({
            page: 1, 
            size: 10, 
            userid: localStorage.getItem("userid") as string,
            setResponse: setContactResponse
        })
    }, [])

    const inputNames=["FirstName", "LastName", "Email", "Phone", "Address", "City", "State", "Postcode"]
    const inputTypes=["text", "text", "text", "text", "text", "text", "text", "text"]
    const inputValues=[useRef(""), useRef(""), useRef(""), useRef(""), useRef(""), useRef(""), useRef(""), useRef("")];

    const getValue = () : string[] => {
        return [inputValues[0].current, inputValues[1].current, inputValues[2].current, inputValues[3].current, inputValues[4].current, inputValues[5].current, inputValues[6].current, inputValues[7].current];
    }

    const doGenerateContactInput = (inputNames: string[], inputTypes: string[], inputValues: string[]) : ReactNode => {
        return (
            <div className="w-200">
                {inputNames.map((name, index) => {
                    return InputField(name, inputTypes[index], inputValues[index], "normal");
                })}
            </div>
        )
    }

    const eventHandlerMap = ( id: string, originStyle: string, contact: Contact) => {
        return {     
            onMouseOver: () => {
                document.getElementById(id)?.setAttribute("class", originStyle + " hover:bg-blue-500 hover:text-white");
            },
            onMouseOut: () => {
                document.getElementById(id)?.setAttribute("class", originStyle);
            },
            onClick: () => {

                inputValues[0].current = contact.firstName;
                inputValues[1].current = contact.lastName;
                inputValues[2].current = contact.email;
                inputValues[3].current = contact.phone;
                inputValues[4].current = contact.address;
                inputValues[5].current = contact.city;
                inputValues[6].current = contact.state;
                inputValues[7].current = contact.postcode;
                setDropdown(!dropdown); // close dropdown
            }
        }
    };

    return (
        <div className="m-20">
            <div className="ml-20">
                <strong className="text-2xl">Product</strong>
                <table className="table-auto w-200 h-100 text-right">
                    <thead>
                        <tr className="border-b border-gray-400">
                            <th></th>
                            <th>Name</th>
                            <th>Qty</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayProducts()}
                    </tbody>
                </table>
            </div>
            <div className="ml-20 mt-20 ">
            <strong className="text-2xl">Post Address</strong>
                <BasicButton buttonColor="white" textColor="black" buttonName="USE CONTACT" clickHandler={() => setDropdown(!dropdown)}/>
                <DropDown isDropDown={dropdown} items={contactResponse.contacts} eventHandlerMap={eventHandlerMap}/>
                {doGenerateContactInput(inputNames, inputTypes, getValue())}
            </div>
            <div className="ml-20 mt-20">
                <strong className="text-2xl">Billing Address</strong>
                <BasicButton buttonColor="white" textColor="black" buttonName="SAME AS POST ADDRESS" clickHandler={() => alert("yes")}/>
                {doGenerateContactInput(inputNames, inputTypes, getValue())}
            </div>
            <div className="ml-20 mt-20">
                <textarea className="w-200 h-100 border-1"></textarea>
            </div>
            <div className="ml-20 mt-20">
                <button>BUY</button>
            </div>
        </div>
    )
}

export default Checkout;