import { useEffect, useRef, useState } from "react"
import { BlackButton, WhiteButton } from "../components/Button";
import { CartItem, Order } from "../type/ObjectType";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { getCartItem } from "../functions/CartFunction";
import { isUserSignedIn } from "../functions/UserFunction";
import { useNavigate } from "react-router";
import SingleOrderCheckoutPage from "./SingleOrderCheckoutPage";
import { MonoStyleText } from "../components/Text";
import { placeOrder } from "../functions/OrderFunction";


function CheckoutPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [separateOrder, setSeparateOrder] = useState<boolean>(false);
    const differentSellers: string[] = cart.map(item => item.sellerName).filter((value, index, self) => self.indexOf(value) === index);
    const postageInfoRef = useRef<string[][]>([]);
    var differentSellerProducts: CartItem[][] = new Array(differentSellers.length);
    var differentOrders : Order[] = [];

    for (let i = 0; i < differentSellers.length; i++) {
        differentSellerProducts[i] = cart.filter(item => item.sellerName == differentSellers[i]);    
        differentOrders.push({
            buyerId: localStorage.getItem("userid") as string,
            purchaseProducts: differentSellerProducts[i].map(item => {return {
                productId: item.productId,
                quantity: item.quantity
            } as CartItem})
        } as Order);
    }
    if (differentSellers.length > 0) {
        postageInfoRef.current = Array.from(Array(differentOrders.length), () => ["", "", "", ""]);
    }

    const getCart = async () => {
        if (isUserSignedIn()) {
            setCart(await getCartItem({userId: localStorage.getItem("userid") as string}));
        }
    }

    useEffect(() => {
        getCart();
    }, []);

    const placeOrderHandler = async () => {
        var orderToPlace: Order[] = [];
        for (let i = 0; i < differentOrders.length; i++) {
            orderToPlace.push(differentOrders[i]);
            orderToPlace[i].fullName = postageInfoRef.current[i][0];
            orderToPlace[i].email = postageInfoRef.current[i][1];
            orderToPlace[i].phone = postageInfoRef.current[i][2];
            orderToPlace[i].address = postageInfoRef.current[i][3];
            if (!separateOrder && differentOrders.length > 1) {
                orderToPlace[i].fullName = postageInfoRef.current[differentOrders.length-1][0];
                orderToPlace[i].email = postageInfoRef.current[differentOrders.length-1][1];
                orderToPlace[i].phone = postageInfoRef.current[differentOrders.length-1][2];
                orderToPlace[i].address = postageInfoRef.current[differentOrders.length-1][3];
            }
        }
        await placeOrder({orders: orderToPlace});
        navigate("/orders");
    }

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={<>
            <ResponsiveDiv style="mt-10 flex flex-row items-center gap-10 justify-center" children={<>
                {!separateOrder && <WhiteButton buttonName="FILL POST/BILLING FOR SEPARATE ORDER" size="w-100 h-10" clickHandler={() => {
                    setSeparateOrder(true);
                }} />}
                {separateOrder && <BlackButton buttonName="FILL POST/BILLING FOR ALL ORDER" size="w-100 h-10" clickHandler={() => {
                    setSeparateOrder(false);
                }} />}
                <MonoStyleText style={"w-100 h-10 text-center text-3xl"} content={"=> " + (separateOrder ? "SEPARATE" : "TOGETHER") + "[NOW]"} />
            </>} />
            {differentSellers.map((sellerName, index) => {
                return <ResponsiveDiv key={index} style="mt-10 flex flex-col" children={<>
                    <MonoStyleText style="w-full py-2 text-2xl bg-black text-white text-center" content={"NO." + (index+1) + " Order For Seller " + sellerName} />
                    <SingleOrderCheckoutPage cart={differentSellerProducts[index]} postageInfoRef={postageInfoRef.current[index]} separate={separateOrder ? separateOrder : index == differentSellers.length - 1} />
                    {index == differentSellers.length - 1 && <ResponsiveDiv style="gap-5 flex flex-row" children={<>
                        <BlackButton buttonName="PLACE ORDER" size="w-60 h-10" clickHandler={() => {
                            placeOrderHandler();
                        }} />
                        <BlackButton buttonName="BACK" size="w-60 h-10" clickHandler={() => {navigate("/cart")}} />
                    </>} />}   
                </>} />       
            })}       
        </>} />
    )
}

export default CheckoutPage;