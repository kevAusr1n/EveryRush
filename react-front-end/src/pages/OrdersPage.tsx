//import { ReactNode, useEffect, useRef, useState } from "react";
//import { isUserLoggedIn } from "../functions/UserUtils";
//import { useNavigate } from "react-router";
//import axios from "axios";

import { useState } from "react";
import { BorderlessButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { CartItem, Order, OrderProcess } from "../type/EntityType";
import OrderBoxPage from "./OrderBoxPage";
import { OptionInput } from "../components/InputField";

function OrdersPage() {
    const [term, SearchTerm] = useState("");
    const [searchButtonName, setSearchButtonName] = useState("ID");

    var orders: Order[] = [];
    orders.push({
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        status: 2,
        sellerName: "Kevn-Seller",
        fullName: "Kevin-Buyer",
        email: "test@qq.com",
        phone: "1234567890",
        address: "1234 Main St, 6101,wa",
        totalPrice: 1299,
        cartItems: [],
        orderProcesses: []
    } as Order);

    orders[0].cartItems.push({
        id: crypto.randomUUID(),
        name: "Test Product 1",
        price: 1299,
        quantity: 2,
        imageUrl: "images/c03c5c5d-f8c2-480c-b12e-9fb58b00bc0f-bb10c217-64b9-4962-ab68-447c00a6b464-20250224212309-image.jpeg,images/c03c5c5d-f8c2-480c-b12e-9fb58b00bc0f-311f5578-57d8-4c0c-a991-7a34de48e469-20250224212309-image.png,images/c03c5c5d-f8c2-480c-b12e-9fb58b00bc0f-b299c1b6-ec0a-46b0-a260-01f40b152583-20250224212309-image.jpeg,images/c03c5c5d-f8c2-480c-b12e-9fb58b00bc0f-4ac7e92f-f10a-463b-90a9-5ae88dbf7353-20250224212309-image.jpeg",
    } as CartItem);
    orders[0].cartItems.push({
        id: crypto.randomUUID(),
        name: "Test Product 2",
        price: 2199,
        quantity: 1,
        imageUrl: "images/c03c5c5d-f8c2-480c-b12e-9fb58b00bc0f-bb10c217-64b9-4962-ab68-447c00a6b464-20250224212309-image.jpeg,images/c03c5c5d-f8c2-480c-b12e-9fb58b00bc0f-311f5578-57d8-4c0c-a991-7a34de48e469-20250224212309-image.png,images/c03c5c5d-f8c2-480c-b12e-9fb58b00bc0f-b299c1b6-ec0a-46b0-a260-01f40b152583-20250224212309-image.jpeg,images/c03c5c5d-f8c2-480c-b12e-9fb58b00bc0f-4ac7e92f-f10a-463b-90a9-5ae88dbf7353-20250224212309-image.jpeg",
    } as CartItem);
    orders[0].orderProcesses.push({
        id: crypto.randomUUID(),
        fromStatus: 0,
        toStatus: 1,
        fromUserName: "Kevin-Buyer",
        toUserName: "Kevn-Seller",
        createAt: new Date(),
        event: "Kevn-Seller accept this order",
        comment: "Will ship in soonr"
    } as OrderProcess);
    orders[0].orderProcesses.push({
        id: crypto.randomUUID(),
        fromStatus: 1,
        toStatus: 2,
        fromUserName: "Kevin-Seller",
        toUserName: "Kevn-Buyer",
        createAt: new Date(),
        event: "Kevn-Buyer finish this order",
        comment: "Item received"
    } as OrderProcess);

    const [focusFilterButtonIndex, setFocusFilterButtonIndex] = useState(0);
    const filterButtonNames = ["ALL", "IN PROCESS", "FINISHED"];
    const focusButtonStyle = "w-40 h-10 border-b-1 bg-black text-white transition hover:bg-black hover:text-white focus:bg-black focus:text-white";
    const unfocusButtonStyle = "w-40 h-10 border-b-1 bg-white text-black transition hover:bg-black hover:text-white focus:bg-black focus:text-white";
    
    return <ResponsiveDiv style="flex flex-col mt-20" children={[
        <ResponsiveDiv style="flex flex-row mx-20 mb-5 gap-5 justify-center" children={[
            filterButtonNames.map((buttonName, index) => {
                return <BorderlessButton style={index == focusFilterButtonIndex ? focusButtonStyle : unfocusButtonStyle} buttonName={buttonName} clickHandler={() => {setFocusFilterButtonIndex(index)}} />
            }),
            <OptionInput inputName="Search" inputValue="ID,KEYWORD" style="left,w-200,w-59" />
        ]} />,            
        <ResponsiveDiv style="flex flex-col ml-20 mr-20 mb-5 shadow-xl" children={[
            <OrderBoxPage order={orders[0]} />
        ]} />,
        <ResponsiveDiv style="flex flex-col ml-20 mr-20 shadow-xl" children={[
            <OrderBoxPage order={orders[0]} />
        ]} />
    ]} />
}

export default OrdersPage;