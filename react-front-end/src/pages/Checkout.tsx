import { ReactNode, useState } from "react"
import { BasicButton } from "../components/Button";
import DropDown from "../components/Dropdown";
import InputField from "../components/InputField";

function Checkout() {
    const [dropdown, setDropdown] = useState(false);

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

    const inputNames=["FirstName", "LastName", "Email", "Phone", "Address", "City", "State", "Postcode"]
    const inputTypes=["text", "text", "text", "text", "text", "text", "text", "text"]
    const inputValues=["", "", "", "", "", "", "", ""]

    const doGenerateContactInput = (inputNames: string[], inputTypes: string[], inputValues: string[]) : ReactNode => {
        return (
            <div className="w-200">
                {inputNames.map((name, index) => {
                    return InputField(name, inputTypes[index], inputValues[index]);
                })}
            </div>
        )
    }

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
                <DropDown isDropDown={dropdown} />
                {doGenerateContactInput(inputNames, inputTypes, inputValues)}
            </div>
            <div className="ml-20 mt-20">
                <strong className="text-2xl">Billing Address</strong>
                <BasicButton buttonColor="white" textColor="black" buttonName="SAME AS POST ADDRESS" clickHandler={() => alert("yes")}/>
                {doGenerateContactInput(inputNames, inputTypes, inputValues)}
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