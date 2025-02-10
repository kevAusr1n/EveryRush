import { ReactNode } from "react"
import FormTable from "./FormTable";
import GenerateInputRowFormat from "../functions/InputRowGenerator";

function Checkout() {
    const displayProducts = () : ReactNode => {
        let productsInCart = sessionStorage.getItem("cart");
        let productsInCartJson = JSON.parse(productsInCart as string);

        return productsInCartJson.products.map((product: any) => {
            return (
                <div className="flex flex-col w-100">
                    <p>Product: {product.name}</p>
                    <p>Price: {product.price}</p>
                    <p>Qty:{product.quantity}</p>
                </div>
            )
        })
    }

    const inputNames=["FirstName", "LastName", "Email", "Phone", "Address", "City", "State", "Postcode"]
    const inputTypes=["text", "text", "text", "text", "text", "text", "text", "text"]
    const inputValues=["", "", "", "", "", "", "", ""]

    const doGenerateContactInput = (inputNames: string[], inputTypes: string[], inputValues: string[]) : ReactNode => {
        return inputNames.map((name, index) => {
            return GenerateInputRowFormat(name, inputTypes[index], inputValues[index]);
        })
    }

    return (
        <>
            <div className="flex m-20">
                <h1>Product Information</h1>
                {displayProducts()}
            </div>
            <div>
                <h1>Post Address</h1>
                {doGenerateContactInput(inputNames, inputTypes, inputValues)}
            </div>
            <div>
                <h1>Billing Address</h1>
                {doGenerateContactInput(inputNames, inputTypes, inputValues)}
            </div>
        </>
    )
}

export default Checkout;