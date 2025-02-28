import { useEffect, useRef, useState } from "react"
import { BlackButton, WhiteButton } from "../components/Button";
import { CartItem, Order } from "../type/EntityType";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { getCart } from "../functions/CartFunction";
import { isUserSignedIn } from "../functions/UserFunction";
import { useNavigate } from "react-router";
import SingleOrderCheckoutPage from "./SingleOrderCheckoutPage";
import { placeOrder } from "../functions/OrderFunction";
import { MonoStyleText } from "../components/Text";


function CheckoutPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [separateOrder, setSeparateOrder] = useState<boolean>(false);

    useEffect(() => {
        if (isUserSignedIn()) {
            getCart({userId: localStorage.getItem("userid") as string, setCart: setCart});
        }
    }, [])
    
    const placeOrderHandler = async () => {
        if (!separateOrder && differentOrders.current.length > 1) {
            for (let i = 0; i < differentOrders.current.length - 1; i++) {
                differentOrders.current[i].fullName = differentOrders.current[differentOrders.current.length - 1].fullName;
                differentOrders.current[i].email = differentOrders.current[differentOrders.current.length - 1].email;
                differentOrders.current[i].phone = differentOrders.current[differentOrders.current.length - 1].phone;
                differentOrders.current[i].address = differentOrders.current[differentOrders.current.length - 1].address;
            }
        }
        await placeOrder({orders: differentOrders.current});
        navigate("/orders");
    }

    const differentSellers: string[] = cart.map(item => item.sellerName).filter((value, index, self) => self.indexOf(value) === index);
    //var differentOrders = new Array(differentSellers.length).fill(useRef<>());
    var differentSellerProducts: CartItem[][] = new Array(differentSellers.length);
    var differentOrders = useRef<Order[]>([]);

    for (let i = 0; i < differentSellers.length; i++) {
        differentSellerProducts[i] = cart.filter(item => item.sellerName == differentSellers[i]);
        if (differentOrders.current.length < differentSellers.length) {
            differentOrders.current.push({
                id: "",
                buyerId: localStorage.getItem("userid"),
                purchaseProducts: differentSellerProducts[i],
                fullName: "",
                email: "",
                phone: "",
                address: ""
            } as Order);
        }
    }

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={[
            <ResponsiveDiv style="mt-10 flex flex-row items-center gap-10 justify-center" children={[
                !separateOrder && <WhiteButton buttonName="FILL POST/BILLING FOR SEPARATE ORDER" size="w-100 h-10" clickHandler={() => {
                    setSeparateOrder(true);
                }} />,
                separateOrder && <BlackButton buttonName="FILL POST/BILLING FOR ALL ORDER" size="w-100 h-10" clickHandler={() => {
                    setSeparateOrder(false);
                }} />,
                <MonoStyleText style={"w-100 h-10 text-center text-3xl"} content={"=> " + (separateOrder ? "SEPARATE" : "TOGETHER") + "[NOW]"} />
            ]} />,
            differentSellers.map((sellerName, index) => {
                return <ResponsiveDiv style="mt-10 flex flex-col" children={[
                    <MonoStyleText style="w-full py-2 text-2xl bg-black text-white text-center" content={"NO." + (index+1) + " Order For Seller " + sellerName} />,
                    <SingleOrderCheckoutPage cart={differentSellerProducts[index]} order={differentOrders.current[index]} separate={separateOrder ? separateOrder : index == differentSellers.length - 1} />,
                    index == differentSellers.length - 1 && <ResponsiveDiv style="gap-5 flex flex-row" children={[
                        <BlackButton buttonName="PLACE ORDER" size="w-60 h-10" clickHandler={() => {
                            placeOrderHandler();
                        }} />,
                        <BlackButton buttonName="BACK" size="w-60 h-10" clickHandler={() => {navigate("/cart")}} />
                    ]} />   
                ]} />       
            })        
        ]} />
    )
}

export default CheckoutPage;