import { ReactNode } from "react";

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
            return <img src={imageContent} className="w-32 h-32"/>
        } else {
            return <></>
        }
    }

    return (
        <div className="border-1 border-grey-200 rounded-lg h-60 w-100 m-5">
            <h3>{props.product.name}</h3>
            <p>{props.product.description}</p>
            <p>${props.product.price}</p>
            <p>{props.product.stock}</p>
            {displayImageIfThereIs()}
            <button onClick={addToCart} className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
            py-2 px-4 rounded-full mr-2">
                Add To Cart
            </button> 
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
            py-2 px-4 rounded-full mr-2">
                Purchase
            </button> 
        </div>    
    )
}

export default ProductBox;