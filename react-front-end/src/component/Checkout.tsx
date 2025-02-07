import { ReactNode } from "react"

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

    return (
        <>
            <div className="flex m-20">
                <h1>Product Information</h1>
                {displayProducts()}
            </div>
            <div>
                <h1>Post Address</h1>
            </div>
            <div>
                <h1>Post Address</h1>
            </div>
            <div>
                <h1>Billing Address</h1>
            </div>
        </>
    )
}

export default Checkout;