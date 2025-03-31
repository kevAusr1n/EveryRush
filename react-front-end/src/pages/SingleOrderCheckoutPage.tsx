import { createElement,ReactNode, useEffect, useState } from "react"
import { WhiteButton } from "../components/Button";
import DropDown from "../components/Dropdown";
import InputField from "../components/InputField";
import { GetContactsResponse } from "../type/ResponseType";
import { getPaginatedContacts } from "../functions/ContactFunction";
import { CartItem, Contact } from "../type/ObjectType";
import { ImageBrief } from "../components/Image";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import DisplayTable from "../components/DisplayTable";
import { imageRoot } from "../config/BackendServerConfig";
import { isUserSignedIn } from "../functions/UserFunction";
import { MonoStyleText } from "../components/Text";


function SingleOrderCheckoutPage(props: {
    cart: CartItem[],
    postageInfoRef: string[],
    separate: boolean
}) {
    const [dropdown, setDropdown] = useState(false);
    const [contactResponse, setContactResponse] = useState<GetContactsResponse>({contacts: [], totalPages: 0, totalCount: 0});
    let totalPrice = 0;

    const getContact = async() => {
        setContactResponse(await getPaginatedContacts({
            page: 1, 
            size: 100, 
            userid: localStorage.getItem("userid") as string,
        }));
    }

    useEffect(() => {
        if (isUserSignedIn()) {
            getContact();
        }
    }, [])

    const contactInputFieldNames=["FirstName", "LastName", "Email", "Phone", "Address", "City", "State", "Postcode"]
    const contactInputFieldTypes=new Array(contactInputFieldNames.length).fill("text");
    const contactInputFieldValueStates=[
        useState(""), useState(""), useState(""), useState(""), useState(""), useState(""), useState(""), useState("")
    ];

    const updatePostageInfoRef = () => {
        props.postageInfoRef.splice(0, 4,
            [contactInputFieldValueStates[0][0], contactInputFieldValueStates[1][0]].join(" "),
            contactInputFieldValueStates[2][0],
            contactInputFieldValueStates[3][0],
            [
                contactInputFieldValueStates[4][0], 
                contactInputFieldValueStates[5][0], 
                contactInputFieldValueStates[6][0], 
                contactInputFieldValueStates[7][0]
            ].join(",")
        );
    }

    useEffect(() => {
        updatePostageInfoRef();
    }, [contactInputFieldValueStates]);

    const tableHead: string[] = ["", "Product", "Seller", "Price", "Quantity"];
    let tableContent: ReactNode[][] = [];

    props.cart.map((cartItem: CartItem, index: number) => {
        totalPrice = totalPrice + cartItem.quantity * cartItem.price;
        tableContent[index] = []
        tableContent[index].push(<ImageBrief src={imageRoot + (cartItem.imageUrl as string).split(",")[0]} style="w-32 h-32"/>);
        tableContent[index].push(createElement("p", {}, cartItem.name) as ReactNode);
        tableContent[index].push(createElement("p", {}, cartItem.sellerName) as ReactNode);
        tableContent[index].push(createElement("p", {}, "$" + cartItem.price) as ReactNode);
        tableContent[index].push(createElement("p", {}, cartItem.quantity) as ReactNode);
    })

    const useContactButtonHandler = ( id: string, originStyle: string, contact: Contact) => {
        return {     
            onMouseOver: () => {
                setDropdown(true);
                document.getElementById(id)?.setAttribute("class", originStyle + " hover:bg-black hover:text-white");
            },
            onMouseOut: () => {
                setDropdown(false);
                document.getElementById(id)?.setAttribute("class", originStyle);
            },
            onClick: () => {
                contactInputFieldValueStates[0][1](contact.firstName);
                contactInputFieldValueStates[1][1](contact.lastName);
                contactInputFieldValueStates[2][1](contact.email);
                contactInputFieldValueStates[3][1](contact.phone);
                contactInputFieldValueStates[4][1](contact.address);
                contactInputFieldValueStates[5][1](contact.city);
                contactInputFieldValueStates[6][1](contact.state);
                contactInputFieldValueStates[7][1](contact.postcode);
                updatePostageInfoRef();
                setDropdown(!dropdown);
            }
        }
    };
    
    return (
        <ResponsiveDiv style="flex flex-col items-center" children={<>
            <ResponsiveDiv style="mt-20 mb-20 gap-5 flex flex-col items-center xl:items-start" children={<>
                <DisplayTable tableHead={tableHead} tableContent={tableContent} />
                <ResponsiveDiv key={crypto.randomUUID()} style="mt-10 w-full flex flex-col items-center xl:flex-row xl:justify-end" children={<>
                    <MonoStyleText style="xl:text-5xl" content={"Total: $" + totalPrice} />
                </>} />
                {props.separate && <ResponsiveDiv style="flex flex-col mt-10" children={<>
                    <ResponsiveDiv style="flex flex-row gap-5" children={<>
                        <MonoStyleText style="text-2xl" content="Post Information" />
                        <ResponsiveDiv style="flex flex-col" eventHandlerMap={{
                            onMouseOut: () => {
                                setDropdown(false);
                            },
                        }}children={<>
                            <WhiteButton buttonName="USE CONTACT" size="w-60 h-10" scalable={false} clickHandler={() => setDropdown(!dropdown)}/>
                            {contactResponse.contacts.length == 0 && dropdown && <ResponsiveDiv style="bg-white border" children={<>
                                <MonoStyleText style="p-20 text-2xl" content="No Contact Found" />
                            </>} />}
                            <ResponsiveDiv style="" children={<>
                                <DropDown dropDown={dropdown} items={contactResponse.contacts} eventHandlerMap={useContactButtonHandler} />
                            </>} />
                        </>} />
                    </>} />
                    {contactInputFieldNames.map((name : string , index : number) => {
                        return <InputField key={index} name={name} type={contactInputFieldTypes[index]} 
                        value={contactInputFieldValueStates[index][0]} style="w-full xl:w-200" valueChangeHandler={(e) => contactInputFieldValueStates[index][1](e.target.value)} />
                    })}
                </>} />}
            </>} />
        </>} />
    )
}

export default SingleOrderCheckoutPage;