import { ReactNode } from "react";
import { BasicButton } from "../components/Button";

function ProductBox(props: {product : any}) 
{    
    const addToCart = () => {
        let thisProduct = {
            id: props.product.id,
            name: props.product.name,
            price: props.product.price,
            quantity: 1
        }

        let productsInCart = sessionStorage.getItem("cart");
       
        if (productsInCart == null || productsInCart == "null") {
            let productsInCartJson = {
                products: [thisProduct]
            };
            sessionStorage.setItem("cart", JSON.stringify(productsInCartJson));
        } else {
            let productsInCartJson = JSON.parse(productsInCart);

            for (var index in productsInCartJson.products) {
                if (productsInCartJson.products[index].id == thisProduct.id) {
                    productsInCartJson.products[index].quantity = productsInCartJson.products[index].quantity + 1;
                    sessionStorage.setItem("cart", JSON.stringify(productsInCartJson));
                    return;
                }
            }
            productsInCartJson.products.push(thisProduct)
            sessionStorage.setItem("cart", JSON.stringify(productsInCartJson));
        }
    }

    const displayImageIfThereIs = () : ReactNode => {
        if (props.product.appFiles != null && props.product.appFiles.length > 0) {
            const imageContent : string = `data:${props.product.appFiles[0].format};base64,${props.product.appFiles[0].content}`
            return <img src={imageContent} className="float-left w-64 h-64"/>
        } else {
            return <></>
        }
    }

    return (
        <div className="gap-5 border-1 m-5 p-5 flex flex-col items-center">
            {displayImageIfThereIs()}
            <strong>{props.product.name}</strong>
            <p>price: ${props.product.price}</p>
            <p>stock: {props.product.stock}</p>
            <BasicButton color="black" buttonName="ADD TO CART" clickHandler={addToCart} /> 
            <BasicButton color="black" buttonName="PURCHASE" clickHandler={addToCart} />  
        </div>    
    )
}

export default ProductBox;