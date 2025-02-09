import { ReactNode, useState } from "react";
import { redirect } from "react-router";

function Cart() {
    const [refreshThisPage, setRefreshThisPage] = useState(false);

    const changeQuantity = (products : any, thisProduct: any, change: number) => {
        products.map((product: any) => {
            if (product.id == thisProduct.id) {
                if (product.quantity + change <= 0) {
                    alert("You can't have a negative quantity");
                    return;
                }
                product.quantity += change;
                sessionStorage.setItem("cart", JSON.stringify({products: products}));
                setRefreshThisPage(!refreshThisPage);
            }
        })
    }

    const removeFromCart = (products : any, thisProduct: any) => {
        if (products == null) {
            sessionStorage.removeItem("cart");
        } else {
            products = products.filter((product : any) => product.id != thisProduct.id);
            sessionStorage.setItem("cart", JSON.stringify({products: products}));
        }
        setRefreshThisPage(!refreshThisPage);
    }

    const displayCart = () : ReactNode => {
        let productsInCart = sessionStorage.getItem("cart");

        if (productsInCart == null || productsInCart == "null") {
            return (<p>There is no product in your cart.</p>)
        } else {
            let productsInCartJson = JSON.parse(productsInCart);

            return (
                <>
                    {productsInCartJson.products.map((product: any) => {
                    return (
                        <div className="flex flex-col border-1 border-grey-200 rounded-lg w-100">
                            <p>Product: {product.name}</p>
                            <p>Price: {product.price}</p>
                            <div className="flex">
                                <button onClick={() => changeQuantity(productsInCartJson.products, product, 1)} className="bg-blue-500 text-white w-5 h-5">+</button>
                                <p>Qty:{product.quantity}</p>
                                <button onClick={() => changeQuantity(productsInCartJson.products, product, -1)} className="bg-blue-500 text-white w-5 h-5">-</button>
                            </div>
                            <button onClick={() => removeFromCart(productsInCartJson.products, product)} className="bg-red-500 text-white">Remove</button>
                        </div>
                    )})}
                    <div className="flex m-20">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded 
                                focus:outline-none focus:shadow-outline" onClick={() => removeFromCart(null, null)}>
                                REMOVE ALL
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                                focus:outline-none focus:shadow-outline" onClick={() => goCheckout()}>
                                CHECKOUT
                        </button>
                    </div>
                </>
            )    
        }  
    }

    const goCheckout = () => {
        let productsInCart = sessionStorage.getItem("cart");

        if (productsInCart == null || productsInCart == "null") {
            alert("You have nothing to checkout.")
        }

        redirect("/checkout");
    }

    return (
        <>
            <div className="flex m-20 items-center justify-center">
                {displayCart()}
            </div>
        </>
    )
}

export default Cart;