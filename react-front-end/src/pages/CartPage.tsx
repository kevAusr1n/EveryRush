import { createElement, JSX, ReactNode, useRef, useState } from "react";
import { useNavigate } from "react-router";
import DisplayTable from "../components/DisplayTable";
import CountEditor from "../components/CountEditor";
import { BasicButton } from "../components/Button";
import { addToCart, removeFromCart } from "../functions/CartFunction";
import ImageBrief from "../components/ImageBrief";
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
                tableContent[index].push(<BasicButton key={crypto.randomUUID()} buttonColor="bg-red-500" textColor="text-white" buttonName="DELETE" clickHandler={() => {
                    removeFromCart({cartItem: cartItem});
                    setRefreshPage(!refreshPage);
                }}/> as ReactNode);
            })

            return (
                <ResponsiveDiv style="flex flex-col justify-center" children={[
                    <DisplayTable key={crypto.randomUUID()} tableHead={tableHead} tableContent={tableContent} />,
                    <ResponsiveDiv key={crypto.randomUUID()} style="flex flex-row m-20 justify-center gap-10" children={[
                        <BasicButton key={crypto.randomUUID()} buttonColor="bg-blue-500" textColor="text-white" buttonName="CHECKOUT" clickHandler={() => goCheckout()}/>,
                        <BasicButton key={crypto.randomUUID()} buttonColor="bg-blue-500" textColor="text-white" buttonName="BACK" clickHandler={() => navigate("/index/products")}/>
                    ]} />
                ]} />
            )
        }  
    }

    const goCheckout = () => {
        let productsInCart = sessionStorage.getItem("cart");
        if (productsInCart == null || productsInCart == "null") {
            alert("You have nothing to checkout.");
            return;
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

export default CartPage;