import { createElement, JSX, ReactNode, useRef, useState } from "react";
import { useNavigate } from "react-router";
import DisplayTable from "../components/DisplayTable";
import CountEditor from "../components/CountEditor";
import { BlackButton, RedButton } from "../components/Button";
import { addToCart, removeFromCart } from "../functions/CartFunction";
import { ImageBrief } from "../components/Image";
import { backServerEndpoint } from "../config/BackendServerConfig";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { CartItem } from "../type/EntityType";

function CartPage() {
    const [refreshPage, setRefreshPage] = useState(false);
    const navigate = useNavigate();

    const displayCart = () : ReactNode => {
        let cart = sessionStorage.getItem("cart");

        if (cart == null || cart == "null") {
            return (<p>There is no product in your cart.</p>)
        } else {
            let cartInJson = JSON.parse(cart);
            let tableHead: string[] = ["Product", "Name", "Price", "Quantity", ""];
            let tableContent: ReactNode[][] = [];

            cartInJson.cartItems.map((cartItem: CartItem, index: number) => {
                tableContent[index] = []
                tableContent[index].push(<ImageBrief key={crypto.randomUUID()} src={new URL((cartItem.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32"/>);
                tableContent[index].push(createElement("p", {key: crypto.randomUUID()}, cartItem.name) as ReactNode);
                tableContent[index].push(createElement("p", {key: crypto.randomUUID()}, "$" + cartItem.price) as ReactNode);
                tableContent[index].push(<CountEditor key={crypto.randomUUID()} initial_count={cartItem.quantity} target={cartItem} countChangeHandler={addToCart} /> as ReactNode);
                tableContent[index].push(<RedButton key={crypto.randomUUID()} buttonName="DELETE" size="w-40 h-10" clickHandler={() => {
                    removeFromCart({cartItem: cartItem});
                    setRefreshPage(!refreshPage);
                }}/> as ReactNode);
            })

            return (
                <>
                    <DisplayTable key={crypto.randomUUID()} tableHead={tableHead} tableContent={tableContent} />
                    <ResponsiveDiv key={crypto.randomUUID()} style="flex flex-row m-20 justify-center gap-10" children={[
                        <BlackButton key={crypto.randomUUID()} buttonName="CHECKOUT" size="w-50 h-20" clickHandler={() => goCheckout()}/>,
                        <BlackButton key={crypto.randomUUID()} buttonName="BACK" size="w-50 h-20" clickHandler={() => navigate("/products")}/>
                    ]} />
                </>
            )
        }  
    }

    const goCheckout = () => {
        let productsInCart = sessionStorage.getItem("cart");
        if (productsInCart == null || productsInCart == "null") {
            alert("You have nothing to checkout.");
            return;
        }
        navigate("/checkout");
    }

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={[
            <ResponsiveDiv style="mt-20 mb-20 p-20 flex flex-col items-center" children={[displayCart()]} />
        ]} />
    )
}

export default CartPage;