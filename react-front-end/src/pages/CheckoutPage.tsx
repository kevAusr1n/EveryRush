import { createElement, ReactNode, useEffect, useRef, useState } from "react"
import { BasicButton } from "../components/Button";
import DropDown from "../components/Dropdown";
import InputField from "../components/InputField";
import { GetContactsResponse } from "../type/ResponseType";
import { getPaginatedContacts } from "../functions/ContactFunction";
import { CartItem, Contact } from "../type/EntityType";
import ImageBrief from "../components/ImageBrief";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import DisplayTable from "../components/DisplayTable";
import { backServerEndpoint } from "../config/BackendServerConfig";


function CheckoutPage() {
    const [dropdown, setDropdown] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [cartItems, setCarItems] = useState<CartItem[]>([]);
    const [contactResponse, setContactResponse] = useState<GetContactsResponse>({contacts: [], totalPages: 0, totalCount: 0});

    useEffect(() => {
        if (true) {
            let cartInJson = JSON.parse(sessionStorage.getItem("cart") as string);
            setCarItems(cartInJson.cartItems);
        };
        getPaginatedContacts({
            page: 1, 
            size: 10, 
            userid: localStorage.getItem("userid") as string,
            setResponse: setContactResponse
        })
    }, [])

    const contactInputFieldNames=["FirstName", "LastName", "Email", "Phone", "Address", "City", "State", "Postcode"]
    const contactInputFieldTypes=new Array(contactInputFieldNames.length).fill("text");
    const postContactInputFieldValues=useRef(new Array(contactInputFieldNames.length).fill(""));
    const billContactInputFieldValues=useRef(new Array(contactInputFieldNames.length).fill(""));

    const tableHead: string[] = ["Product", "Name", "Price", "Quantity"];
    let tableContent: ReactNode[][] = [];

    cartItems.map((cartItem: CartItem, index: number) => {
        tableContent[index] = []
        tableContent[index].push(<ImageBrief src={new URL((cartItem.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32"/>);
        tableContent[index].push(createElement("p", {}, cartItem.name) as ReactNode);
        tableContent[index].push(createElement("p", {}, "$" + cartItem.price) as ReactNode);
        tableContent[index].push(createElement("p", {}, cartItem.quantity) as ReactNode);
    })

    const useContactButtonHandler = ( id: string, originStyle: string, contact: Contact) => {
        return {     
            onMouseOver: () => {
                document.getElementById(id)?.setAttribute("class", originStyle + " hover:bg-blue-500 hover:text-white");
            },
            onMouseOut: () => {
                document.getElementById(id)?.setAttribute("class", originStyle);
            },
            onClick: () => {
                postContactInputFieldValues.current = [
                    contact.firstName,
                    contact.lastName,
                    contact.email,
                    contact.phone,
                    contact.address,
                    contact.city,
                    contact.state,
                    contact.postcode
                ];
                setDropdown(!dropdown);
            }
        }
    };

    const copyBillContactFromPostContact = () => {
        billContactInputFieldValues.current = postContactInputFieldValues.current;
        setRefreshPage(!refreshPage);
    }

    return (
        <ResponsiveDiv style="flex flex-col items-center justify-center gap-20" children={[
            <DisplayTable tableHead={tableHead} tableContent={tableContent} />,
            <ResponsiveDiv style="flex flex-col" children={[
                <ResponsiveDiv style="flex flex-row gap-10" children={[
                    <strong className="text-2xl">Post Address</strong>,
                    <BasicButton buttonColor="bg-blue-500" textColor="text-white" buttonName="USE CONTACT" clickHandler={() => setDropdown(!dropdown)}/>,
                    <ResponsiveDiv style="" children={[
                        <DropDown isDropDown={dropdown} items={contactResponse.contacts} eventHandlerMap={useContactButtonHandler} />
                    ]} />
                ]} />,
                contactInputFieldNames.map((name : string , index : number) => {
                    return <InputField inputName={name} inputType={contactInputFieldTypes[index]} inputValue={postContactInputFieldValues.current[index]} style="w-200" />
                })
            ]} />,
            <ResponsiveDiv style="flex flex-col" children={[
                <ResponsiveDiv style="flex flex-row gap-10" children={[
                    <strong className="text-2xl">Billing Address</strong>,
                    <BasicButton buttonColor="bg-blue-500" textColor="text-white" buttonName="SAME AS POST ADDRESS" clickHandler={() => copyBillContactFromPostContact()}/>
                ]} />,
                contactInputFieldNames.map((name : string , index : number) => {
                    return <InputField inputName={name} inputType={contactInputFieldTypes[index]} inputValue={billContactInputFieldValues.current[index]} style="w-200" />
                })
            ]} />
        ]} />
    )
}

export default CheckoutPage;