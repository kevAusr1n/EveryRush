import { createElement, ReactNode, useState } from "react";
import { BlackButton, WhiteButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { ImageBrief } from "../components/Image";
import { MonoStyleText } from "../components/Text";
import { backServerEndpoint } from "../config/BackendServerConfig";
import { CartItem, Order, OrderProcess } from "../type/EntityType";
import OrderStatusConfig from "../config/OrderStatusConfig";
import DisplayTable from "../components/DisplayTable";

function OrderBoxPage(props: {order: Order}) {
    const [dropdown, setDropDown] = useState(false);

    const tableHead: string[] = ["", "Product", "Seller", "Price", "Quantity"];
    let tableContent: ReactNode[][] = [];

    props.order.cartItems.map((cartItem: CartItem, index: number) => {
        tableContent[index] = []
        tableContent[index].push(<ImageBrief src={new URL((cartItem.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32"/>);
        tableContent[index].push(createElement("p", {}, cartItem.name) as ReactNode);
        tableContent[index].push(createElement("p", {}, cartItem.sellerName) as ReactNode);
        tableContent[index].push(createElement("p", {}, "$" + cartItem.price) as ReactNode);
        tableContent[index].push(createElement("p", {}, cartItem.quantity) as ReactNode);
    })


    return <ResponsiveDiv style="flex flex-col gap-5 items-center p-5" children={[
        <MonoStyleText style="w-full text-2xl font-bold border-b-1" content={"Order #" + props.order.id} />,
        <ResponsiveDiv style="w-full flex flex-row justify-between" children={[
            <ResponsiveDiv style="pl-5 flex flex-col gap-5 items-center" children={[
                <ImageBrief src={new URL((props.order.cartItems[0].imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-48 h-48"/>,  
                <MonoStyleText style="text-xl" content={props.order.cartItems.length + " item" + (props.order.cartItems.length > 1 ? "s" : "")} />,
            ]} />,     
            <ResponsiveDiv style="flex flex-col" children={[
                <MonoStyleText style="text-xl" content={"From " + props.order.sellerName + " To " + props.order.fullName} />,
                <MonoStyleText style="text-xl" content={"Email: " + props.order.email} />,
                <MonoStyleText style="text-xl" content={"Phone: " + props.order.phone} />,
                <MonoStyleText style="text-xl" content={"Address: " + props.order.address} />,
                <MonoStyleText style="text-xl" content={"Status: " + OrderStatusConfig.getStatusName(props.order.status)} />,
                <MonoStyleText style="text-xl" content={"Total: " + props.order.totalPrice} />
            ]} />
        ]} />,
        // <MonoStyleText style="text-xl" content={"Total: " + props.order.totalPrice} />,
        // <WhiteButton buttonName="DETAIL" size="w-40 h-10" clickHandler={() => setDropDown(true)} />,
        
        <ResponsiveDiv style="w-full flex flex-row gap-5 justify-end items-center justify-end" children={[
            !dropdown && <WhiteButton buttonName="SHOW DETAIL" size="w-60 h-10" clickHandler={() => setDropDown(true)} />,
            dropdown && <BlackButton buttonName="HIDE DETAIL" size="w-60 h-10" clickHandler={() => setDropDown(false)} />,
            <WhiteButton buttonName="WRITE REVIEW" size="w-60 h-10" clickHandler={() => {}}/>,
            <WhiteButton buttonName="MESSAGE SELLER" size="w-60 h-10" clickHandler={() => {}}/>
        ]} />,
        dropdown && <ResponsiveDiv style="w-full flex flex-col items-start" children={[
            <MonoStyleText style="w-full text-2xl font-bold bg-black text-white px-2" content="PURCHASED ITEMS" />,
            <ResponsiveDiv style="w-full flex flow-col justify-center" children={[
                <DisplayTable tableHead={tableHead} tableContent={tableContent} />
            ]} />,
            <MonoStyleText style="w-full text-2xl font-bold bg-black text-white px-2" content="ORDER PROCESS HISTORY" />,
            props.order.orderProcesses.map((orderProcess : OrderProcess, index: number) => {
                return <ResponsiveDiv style="w-full flex flex-col p-5 border-b-1" children={[
                    <MonoStyleText style="text-xl" content={"From: " + orderProcess.fromUserName} />,
                    <MonoStyleText style="text-xl" content={"To: " + orderProcess.toUserName} />,
                    <MonoStyleText style="text-xl" content={"Status: " + OrderStatusConfig.getStatusName(orderProcess.fromStatus) + " => " + OrderStatusConfig.getStatusName(orderProcess.toStatus)} />,
                    <MonoStyleText style="text-xl" content={"Event: " + orderProcess.event} />,
                    <MonoStyleText style="text-xl" content={"Comment: " + orderProcess.comment} />,
                    <MonoStyleText style="text-xl" content={"Date: " + orderProcess.createAt.toLocaleString()} />,
                ]} />
            })
        ]} />,
    ]} />
}

export default OrderBoxPage;