//import { ReactNode, useEffect, useRef, useState } from "react";
//import { isUserLoggedIn } from "../functions/UserUtils";
//import { useNavigate } from "react-router";
//import axios from "axios";

import { useEffect, useState } from "react";
import { BorderlessButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import OrderBoxPage from "./OrderBoxPage";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { GetOrdersResponse } from "../type/ResponseType";
import { isUserSignedIn } from "../functions/UserFunction";
import SignInRequiredPage from "./SignInRequiredPage";
import { MonoStyleText } from "../components/Text";
import { getPaginatedOrders } from "../functions/OrderFunction";

function OrdersPage() {
    const [size, setSize]  = useState(5);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [focusFilterButtonIndex, setFocusFilterButtonIndex] = useState(0);
    const [response, setResponse] = useState<GetOrdersResponse>({orders:[], totalCount: 0, totalPages: 0});

    useEffect(() => {
        getPaginatedOrders({
            page: page, 
            size: size, 
            searchTerm: searchTerm, 
            status: "",
            setResponse: setResponse
        });
    }, [page, size, searchTerm])

    const filterButtonNames = ["ALL", "IN PROCESS", "FINISHED"];
    const focusButtonStyle = "w-40 h-10 border-b-1 bg-black text-white transition hover:bg-black hover:text-white focus:bg-black focus:text-white";
    const unfocusButtonStyle = "w-40 h-10 border-b-1 bg-white text-black transition hover:bg-black hover:text-white focus:bg-black focus:text-white";
    
    return (
        (!isUserSignedIn() && <SignInRequiredPage message="please sign in to manage orders"/>) ||
        <ResponsiveDiv style="flex flex-col mt-20" children={<>   
            {(focusFilterButtonIndex == 0 && response.orders.length == 0) && <ResponsiveDiv style="flex flex-col items-center gap-5" children={<>
                <MonoStyleText key={crypto.randomUUID()} style="text-xl" content="You have no order" />
            </>} />}   
            {(response.orders.length != 0 || focusFilterButtonIndex != 0) && <ResponsiveDiv style="flex flex-row mx-20 mb-5 gap-5 justify-between" children={<>
                <ResponsiveDiv style="" children={<>
                    {filterButtonNames.map((buttonName, index) => {
                        return <BorderlessButton key={index} style={index == focusFilterButtonIndex ? focusButtonStyle : unfocusButtonStyle} buttonName={buttonName} clickHandler={() => {setFocusFilterButtonIndex(index)}} />
                    })}
                </>} />
                <ResponsiveDiv style="w-1/4 flex flex-row h-10 items-start" children={<>
                    <SearchBar placeHolder="order id, item etc ..." searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </>} />
            </>} />}   
            {response.orders.length != 0 && response.orders.map((order, index) => {
                return (
                    <ResponsiveDiv key={index} style="flex flex-col ml-20 mr-20 mb-5 shadow-xl" children={<>
                        <OrderBoxPage order={order} />
                    </>} />
                )
            })}
            {response.orders.length != 0 && <Pagination 
                    size={size}
                    setSize={setSize}
                    page={page}
                    setPage={setPage}
                    totalPages={response.totalPages}
                    totalCount={response.totalCount} 
                />}
        </>} />
    )
}

export default OrdersPage;