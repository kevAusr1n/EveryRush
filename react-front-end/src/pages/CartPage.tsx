import { createElement, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DisplayTable from "../components/DisplayTable";
import CountEditor from "../components/CountEditor";
import { BlackButton, RedButton } from "../components/Button";
import { addOrUpdateCartItem, getCart, removeFromCart } from "../functions/CartFunction";
import { ImageBrief } from "../components/Image";
import { backServerEndpoint } from "../config/BackendServerConfig";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { CartItem } from "../type/EntityType";
import { isUserSignedIn } from "../functions/UserFunction";
import SignInRequiredPage from "./SignInRequiredPage";

function CartPage() {
    const [refreshPage, setRefreshPage] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (isUserSignedIn()) {
            getCart({userId: localStorage.getItem("userid") as string, setCart: setCart});
        }
    }, [refreshPage]);

    const displayCart = () : ReactNode => {
        if (cart.length == 0) {
            return (
                <ResponsiveDiv style="flex flex-col items-center gap-5" children={[
                    <p key={crypto.randomUUID()} className="text-xl">Your cart is empty</p>,
                    <BlackButton key={crypto.randomUUID()} buttonName="SHOPPING" size="w-40 h-10" clickHandler={() => navigate("/products")} />
                ]} />
            )
        } else {
            let tableHead: string[] = ["Product", "Name", "Price", "Quantity", ""];
            let tableContent: ReactNode[][] = [];

            cart.map((cartItem: CartItem, index: number) => {
                tableContent[index] = []
                tableContent[index].push(<ImageBrief key={crypto.randomUUID()} src={new URL((cartItem.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32"/>);
                tableContent[index].push(createElement("p", {key: crypto.randomUUID()}, cartItem.name) as ReactNode);
                tableContent[index].push(createElement("p", {key: crypto.randomUUID()}, "$" + cartItem.price) as ReactNode);
                tableContent[index].push(<CountEditor key={crypto.randomUUID()} initial_count={cartItem.quantity} target={cartItem} countChangeHandler={addOrUpdateCartItem} /> as ReactNode);
                tableContent[index].push(<RedButton key={crypto.randomUUID()} buttonName="DELETE" size="w-40 h-10" clickHandler={() => {
                    removeFromCart({id: cartItem.id});
                    setRefreshPage(!refreshPage);
                }}/> as ReactNode);
            })

            return (            
                <>
                    <DisplayTable key={crypto.randomUUID()} tableHead={tableHead} tableContent={tableContent} />
                    <ResponsiveDiv key={crypto.randomUUID()} style="flex flex-row m-20 justify-center gap-10" children={[
                        <BlackButton key={crypto.randomUUID()} buttonName="CHECKOUT" size="w-40 h-10" clickHandler={() => goCheckout()}/>,
                        <BlackButton key={crypto.randomUUID()} buttonName="BACK" size="w-40 h-10" clickHandler={() => navigate("/products")}/>
                    ]} />
                </>
                
            )
        }  
    }

    const goCheckout = () => {
        let productsInCart = sessionStorage.getItem("cart");
        if (productsInCart == null || productsInCart == "null") {
            return;
        }
        navigate("/checkout");
    }

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={[
            (!isUserSignedIn() && <SignInRequiredPage message="Cart" />) || 
            <ResponsiveDiv style="mt-20 mb-20 p-20 flex flex-col items-center" children={[displayCart()]} />
        ]} />
    )
}

export default CartPage;