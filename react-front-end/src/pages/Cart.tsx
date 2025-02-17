import { createElement, JSX, ReactNode, useState } from "react";
import { useNavigate } from "react-router";
import DisplayTable from "../components/DisplayTable";
import CountEditor from "../components/CountEditor";
import { BasicButton } from "../components/Button";
import { removeFromCart } from "../functions/CartFunction";

function Cart() {
    const [refreshThisPage, setRefreshThisPage] = useState(false);
    const navigate = useNavigate();

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

    const displayCart = () : ReactNode => {
        let productsInCart = sessionStorage.getItem("cart");

        if (productsInCart == null || productsInCart == "null") {
            return (<p>There is no product in your cart.</p>)
        } else {
            let productsInCartJson = JSON.parse(productsInCart);
            let head: string[] = ["image", "name", "price", "qty", "operation"];
            let nodeMatrix: ReactNode[][] = [];

            productsInCartJson.cartItems.map((product: any, index: number) => {
                nodeMatrix[index] = []
                nodeMatrix[index].push(createElement("p", {}, product.name) as ReactNode);
                nodeMatrix[index].push(createElement("p", {}, product.name) as ReactNode);
                nodeMatrix[index].push(createElement("p", {}, product.price) as ReactNode);
                nodeMatrix[index].push(<CountEditor initial_count={product.quantity} /> as ReactNode);
                nodeMatrix[index].push(<BasicButton buttonColor="red-500" textColor="white" buttonName="DELETE" clickHandler={() => {
                    if (removeFromCart({products: productsInCartJson.cartItems, thisProduct: product})) {
                        setRefreshThisPage(!refreshThisPage);
                    }
                }}/> as ReactNode);
            })

            return (
                <div>
                    <DisplayTable head={head} nodeMatrix={nodeMatrix} />
                    <BasicButton buttonColor="blue-500" textColor="white" buttonName="CHECKOUT" clickHandler={() => goCheckout()}/>
                </div>
            )
        }  
    }

    const goCheckout = () => {
        let productsInCart = sessionStorage.getItem("cart");

        if (productsInCart == null || productsInCart == "null") {
            alert("You have nothing to checkout.")
        }

        navigate("/index/checkout");
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