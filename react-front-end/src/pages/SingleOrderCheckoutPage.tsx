import { createElement, ReactNode, useEffect, useState } from "react"
import { WhiteButton } from "../components/Button";
import DropDown from "../components/Dropdown";
import InputField from "../components/InputField";
import { GetContactsResponse } from "../type/ResponseType";
import { getPaginatedContacts } from "../functions/ContactFunction";
import { CartItem, Contact, Order } from "../type/EntityType";
import { ImageBrief } from "../components/Image";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import DisplayTable from "../components/DisplayTable";
import { backServerEndpoint } from "../config/BackendServerConfig";
import { isUserSignedIn } from "../functions/UserFunction";
import { MonoStyleText } from "../components/Text";


function SingleOrderCheckoutPage(props: {
    cart: CartItem[],
    order: Order,
    separate: boolean
}) {
    const [dropdown, setDropdown] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [contactResponse, setContactResponse] = useState<GetContactsResponse>({contacts: [], totalPages: 0, totalCount: 0});
    let totalPrice = 0;

    useEffect(() => {
        if (isUserSignedIn()) {
            getPaginatedContacts({
                page: 1, 
                size: 10, 
                userid: localStorage.getItem("userid") as string,
                setResponse: setContactResponse
            })
        }
    }, [])

    const contactInputFieldNames=["FirstName", "LastName", "Email", "Phone", "Address", "City", "State", "Postcode"]
    const contactInputFieldTypes=new Array(contactInputFieldNames.length).fill("text");
    //const postContactInputFieldValues=useRef(new Array(contactInputFieldNames.length).fill(""));
    //const billContactInputFieldValues=useRef(new Array(contactInputFieldNames.length).fill(""));
    const postInformation = [useState(""), useState(""), useState(""), useState(""), useState(""), useState(""), useState(""), useState("")];
    const billInformation = [useState(""), useState(""), useState(""), useState(""), useState(""), useState(""), useState(""), useState("")];

    const tableHead: string[] = ["", "Product", "Seller", "Price", "Quantity"];
    let tableContent: ReactNode[][] = [];

    props.cart.map((cartItem: CartItem, index: number) => {
        totalPrice = totalPrice + cartItem.quantity * cartItem.price;
        tableContent[index] = []
        tableContent[index].push(<ImageBrief src={new URL((cartItem.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32"/>);
        tableContent[index].push(createElement("p", {}, cartItem.name) as ReactNode);
        tableContent[index].push(createElement("p", {}, cartItem.sellerName) as ReactNode);
        tableContent[index].push(createElement("p", {}, "$" + cartItem.price) as ReactNode);
        tableContent[index].push(createElement("p", {}, cartItem.quantity) as ReactNode);
    })

    const useContactButtonHandler = ( id: string, originStyle: string, contact: Contact) => {
        return {     
            onMouseOver: () => {
                document.getElementById(id)?.setAttribute("class", originStyle + " hover:bg-black hover:text-white");
            },
            onMouseOut: () => {
                document.getElementById(id)?.setAttribute("class", originStyle);
            },
            onClick: () => {
                props.order.address = [contact.address, contact.city, contact.state, contact.postcode].join(", ");
                props.order.fullName = [contact.firstName, contact.lastName].join(" ");
                props.order.email = contact.email;
                props.order.phone = contact.phone;
                postInformation[0][1](contact.firstName);
                postInformation[1][1](contact.lastName);
                postInformation[2][1](contact.email);
                postInformation[3][1](contact.phone);
                postInformation[4][1](contact.address);
                postInformation[5][1](contact.city);
                postInformation[6][1](contact.state);
                postInformation[7][1](contact.postcode);
                setDropdown(!dropdown);
            }
        }
    };

    const copyBillInfoFromPostInfo = () => {
        for (let i = 0; i < contactInputFieldNames.length; i++) {
            billInformation[i][1](postInformation[i][0]);
        };
        setRefreshPage(!refreshPage);
    }
    
    return (
        <ResponsiveDiv style="flex flex-col items-center" children={[
            <ResponsiveDiv style="mt-20 mb-20 gap-5 flex flex-col items-start" children={[
                <DisplayTable tableHead={tableHead} tableContent={tableContent} />,
                <ResponsiveDiv key={crypto.randomUUID()} style="mt-10 w-full flex flex-row justify-end" children={[
                    <MonoStyleText style="text-5xl" content={"Total: $" + totalPrice} />
                ]} />,
                props.separate && <ResponsiveDiv style="flex flex-col mt-10" children={[
                    <ResponsiveDiv style="flex flex-row gap-5" children={[
                        <MonoStyleText style="text-2xl" content="Post Information" />,
                        <WhiteButton buttonName="USE CONTACT" size="w-60 h-10" clickHandler={() => setDropdown(!dropdown)}/>,
                        contactResponse.contacts.length == 0 && dropdown && <ResponsiveDiv style="absolute bg-white border" children={[
                            <MonoStyleText style="p-20 text-2xl" content="No Contact Found" />,
                        ]} />,
                        <ResponsiveDiv style="" children={[
                            <DropDown dropDown={dropdown} items={contactResponse.contacts} eventHandlerMap={useContactButtonHandler} />
                        ]} />
                    ]} />,
                    contactInputFieldNames.map((name : string , index : number) => {
                        return <InputField inputName={name} inputType={contactInputFieldTypes[index]} inputValue={postInformation[index][0]} style="w-200" onTextChangeHandler={postInformation[index][1]} />
                    })
                ]} />,
                props.separate && <ResponsiveDiv style="flex flex-col mt-10" children={[
                    <ResponsiveDiv style="flex flex-row gap-5" children={[
                        <MonoStyleText style="text-2xl" content="Billing Information" />,
                        <WhiteButton buttonName="USE POST ADDRESS" size="w-60 h-10" clickHandler={() => copyBillInfoFromPostInfo()}/>
                    ]} />,
                    contactInputFieldNames.map((name : string , index : number) => {
                        return <InputField inputName={name} inputType={contactInputFieldTypes[index]} inputValue={billInformation[index][0]} style="w-200" onTextChangeHandler={billInformation[index][1]} />
                    })
                ]} />
            ]} />
        ]} />
    )
}

export default SingleOrderCheckoutPage;