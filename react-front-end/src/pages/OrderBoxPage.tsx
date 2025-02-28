import { createElement, ReactNode, useState } from "react";
import { BlackButton, RedButton, WhiteButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { ImageBrief } from "../components/Image";
import { MonoStyleText } from "../components/Text";
import { backServerEndpoint } from "../config/BackendServerConfig";
import { CartItem, Order, OrderProcess } from "../type/EntityType";
import OrderStatusConfig from "../config/OrderStatusConfig";
import DisplayTable from "../components/DisplayTable";
import { isStringEmpty } from "../functions/Utils";
import { isUserCustomerOrGuest } from "../functions/UserFunction";

function OrderBoxPage(props: {order: Order}) {
    const [dropdown, setDropDown] = useState(false);
    const tableHead: string[] = ["", "Product", "Seller", "Price", "Quantity"];

    let tableContent: ReactNode[][] = [];
    props.order.purchaseProducts.map((cartItem: CartItem, index: number) => {
        tableContent[index] = []
        tableContent[index].push(<ImageBrief src={new URL((cartItem.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32"/>);
        tableContent[index].push(createElement("p", {}, cartItem.name) as ReactNode);
        tableContent[index].push(createElement("p", {}, cartItem.sellerName) as ReactNode);
        tableContent[index].push(createElement("p", {}, "$" + cartItem.price) as ReactNode);
        tableContent[index].push(createElement("p", {}, cartItem.quantity) as ReactNode);
    })

    const updateOrderStatusHandler = (status: number) => {
        
    }

    const setButtonBaseOnOrderStatus = (status: number) : ReactNode[] => {
        if (isUserCustomerOrGuest()) {
            if (status === OrderStatusConfig.PENDING || status === OrderStatusConfig.ACCEPTED || status === OrderStatusConfig.IN_DELIVERY || status === OrderStatusConfig.FINISHED) {
                return [
                    <RedButton buttonName="REQUEST REFUND" size="w-60 h-10" clickHandler={() => {updateOrderStatusHandler(OrderStatusConfig.REFUND_REQUESTED)}}/>
                ]
            } else if (status == OrderStatusConfig.IN_DELIVERY) {
                return [
                    <WhiteButton buttonName="RECEVICE" size="w-60 h-10" clickHandler={() => {updateOrderStatusHandler(OrderStatusConfig.FINISHED)}}/>,
                    <RedButton buttonName="REQUEST REFUND" size="w-60 h-10" clickHandler={() => {updateOrderStatusHandler(OrderStatusConfig.REFUND_REQUESTED)}}/>
                ]
            } else {
                return []
            }
        } 
        else {
            if (status === OrderStatusConfig.PENDING) {
                return [
                    <WhiteButton buttonName="ACCEPT" size="w-60 h-10" clickHandler={() => {updateOrderStatusHandler(OrderStatusConfig.ACCEPTED)}}/>,
                    <RedButton buttonName="REJECT" size="w-60 h-10" clickHandler={() => {updateOrderStatusHandler(OrderStatusConfig.REJECTED)}}/>
                ]
            } else if (status === OrderStatusConfig.ACCEPTED) {
                return [
                    <WhiteButton buttonName="DELIVER" size="w-60 h-10" clickHandler={() => {updateOrderStatusHandler(OrderStatusConfig.IN_DELIVERY)}}/>,
                ]
            } else if (status === OrderStatusConfig.REFUND_REQUESTED) {
                return [
                    <WhiteButton buttonName="REFUND APPROVE" size="w-60 h-10" clickHandler={() => {updateOrderStatusHandler(OrderStatusConfig.REFUND_APPROVED)}}/>,
                    <RedButton buttonName="REFUND REJECT" size="w-60 h-10" clickHandler={() => {updateOrderStatusHandler(OrderStatusConfig.REFUND_REJECTED)}}/>,
                ]
            } else if (status === OrderStatusConfig.REFUND_APPROVED) {
                return [
                    <WhiteButton buttonName="REFUND DONE" size="w-60 h-10" clickHandler={() => {updateOrderStatusHandler(OrderStatusConfig.REFUNDED)}}/>,
                ]
            } else {
                return []
            }
        }
    }

    return <ResponsiveDiv style="flex flex-col gap-5 items-center p-5" children={[
        <MonoStyleText style="w-full text-2xl font-bold border-b-1" content={"Order #" + props.order.id} />,
        <ResponsiveDiv style="w-full flex flex-row justify-between" children={[
            <ResponsiveDiv style="pl-5 flex flex-col gap-5 items-center" children={[
                <ImageBrief src={new URL((props.order.purchaseProducts[0].imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-48 h-48"/>,  
                <MonoStyleText style="text-xl" content={props.order.purchaseProducts.length + " item" + (props.order.purchaseProducts.length > 1 ? "s" : "")} />,
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
            isUserCustomerOrGuest() && <WhiteButton buttonName="WRITE REVIEW" size="w-60 h-10" clickHandler={() => {}}/>,
            isUserCustomerOrGuest() && <WhiteButton buttonName="MESSAGE SELLER" size="w-60 h-10" clickHandler={() => {}}/>,
            setButtonBaseOnOrderStatus(props.order.status)
        ]} />,
        dropdown && <ResponsiveDiv style="w-full flex flex-col items-start" children={[
            <MonoStyleText style="w-full text-2xl font-bold bg-black text-white px-2" content="PURCHASED ITEMS" />,
            <ResponsiveDiv style="w-full flex flow-col justify-center" children={[
                <DisplayTable tableHead={tableHead} tableContent={tableContent} />
            ]} />,
            <MonoStyleText style="w-full text-2xl font-bold bg-black text-white px-2" content="ORDER PROCESS HISTORY" />,
            props.order.orderProcesses.map((orderProcess : OrderProcess, index: number) => {
                return <ResponsiveDiv style="w-full flex flex-col p-5 border-b-1" children={[
                    <MonoStyleText style="text-xl" content={"Status: " + OrderStatusConfig.getStatusName(orderProcess.fromOrderStatus) + " => " + OrderStatusConfig.getStatusName(orderProcess.toOrderStatus)} />,
                    <MonoStyleText style="text-xl" content={"Event: " + orderProcess.event} />,
                    <MonoStyleText style="text-xl" content={"Comment: " + (isStringEmpty(orderProcess.comment) ? "No Comment": orderProcess.comment)} />,
                    <MonoStyleText style="text-xl" content={"Date: " + orderProcess.createAt.toLocaleString()} />,
                ]} />
            })
        ]} />,
    ]} />
}

export default OrderBoxPage;