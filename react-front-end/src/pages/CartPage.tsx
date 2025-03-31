import { createElement, ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import DisplayTable from "../components/DisplayTable";
import CountEditor from "../components/CountEditor";
import { BlackButton, RedButton } from "../components/Button";
import { addOrUpdateCartItem, getCartItem, removeFromCart } from "../functions/CartFunction";
import { ImageBrief } from "../components/Image";
import { imageRoot } from "../config/BackendServerConfig";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { CartItem } from "../type/ObjectType";
import { isUserSignedIn } from "../functions/UserFunction";
import SignInRequiredPage from "./SignInRequiredPage";
import { MonoStyleText } from "../components/Text";

function CartPage() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const navigate = useNavigate();
    const [refreshPage, setRefreshPage] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    let totalPrice = useRef(0);

    const getCart = async() => {
        if (isUserSignedIn()) {
            setCart(await getCartItem({userId: localStorage.getItem("userid") as string}));
        }
    }

    useEffect(() => {
        if (isUserSignedIn()) {
            getCart();
        }
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth);
        })
        return () => {
            window.removeEventListener("resize", () => {
                setWindowWidth(window.innerWidth);
            })
        }
    }, [refreshPage]);

    const addOrUpdateCartItemHandler = async (cartItem: CartItem) => {
        await addOrUpdateCartItem({item: cartItem});
        setRefreshPage(!refreshPage);
    };
    
    const removeCartItemHandler = async (id: string) => {
        await removeFromCart({id: id});
        setRefreshPage(!refreshPage);
    }

    const displayCart = () : ReactNode => {
        if (cart.length == 0) {
            return (
                <ResponsiveDiv style="flex flex-col items-center gap-5" children={<>
                    <p key={crypto.randomUUID()} className="text-xl">Your cart is empty</p>
                    <BlackButton key={crypto.randomUUID()} buttonName="SHOPPING" size="w-40 h-10" clickHandler={() => navigate("/products")} />
                </>} />
            )
        } else {
            totalPrice.current = 0;
            let tableHead: string[] = [];
            if (windowWidth >= 1280) {
                tableHead = ["", "Product", "Seller", "Price", "Quantity", ""];
            } else {
                tableHead = ["", "Product", "Seller", "Price", "Quantity"];
            }
            let tableContent: ReactNode[][] = [];

            cart.map((cartItem: CartItem, index: number) => {
                totalPrice.current = totalPrice.current + cartItem.quantity * cartItem.price;
                tableContent[index] = []
                tableContent[index].push(<ImageBrief key={crypto.randomUUID()} src={imageRoot + (cartItem.imageUrl as string).split(",")[0]} style="w-32 h-32"/>);
                tableContent[index].push(createElement("p", {key: crypto.randomUUID()}, cartItem.name) as ReactNode);
                tableContent[index].push(createElement("p", {key: crypto.randomUUID()}, cartItem.sellerName) as ReactNode);
                tableContent[index].push(createElement("p", {key: crypto.randomUUID()}, "$" + cartItem.price) as ReactNode);
                if (windowWidth >= 1280) {
                    tableContent[index].push(<CountEditor key={crypto.randomUUID()} initial_count={cartItem.quantity} target={cartItem} countChangeHandler={addOrUpdateCartItemHandler} /> as ReactNode);
                    tableContent[index].push(<RedButton key={crypto.randomUUID()} buttonName="DELETE" size="w-40 h-10" clickHandler={() => {
                    removeCartItemHandler(cartItem.id);}}/> as ReactNode);
                } else {
                    tableContent[index].push(createElement("p", {key: crypto.randomUUID()}, cartItem.quantity) as ReactNode);
                }
            })

            return (            
                <>
                    <DisplayTable key={crypto.randomUUID()} tableHead={tableHead} tableContent={tableContent} />
                    <ResponsiveDiv key={crypto.randomUUID()} style="ml-20 mr-20 mt-10 w-full flex flex-col items-center xl:flex-row justify-end" children={<>
                        <MonoStyleText style="xl:text-5xl" content={"Total: $" + totalPrice.current} />
                    </>} />
                    <ResponsiveDiv key={crypto.randomUUID()} style="flex flex-col xl:flex-row m-20 justify-center gap-10" children={<>
                        <BlackButton key={crypto.randomUUID()} buttonName="CHECKOUT" size="w-40 h-10" clickHandler={() => goCheckout()}/>
                        <BlackButton key={crypto.randomUUID()} buttonName="BACK" size="w-40 h-10" clickHandler={() => navigate("/products")}/>
                    </>} />
                </>
                
            )
        }  
    }

    const goCheckout = () => {
        navigate("/checkout");
    }

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={<>
            {(!isUserSignedIn() && <SignInRequiredPage message="please sign in to manage cart" />) || 
            <ResponsiveDiv style="mt-20 mb-20 p-20 flex flex-col items-center" children={displayCart()} />}
        </>} />
    )
}

export default CartPage;