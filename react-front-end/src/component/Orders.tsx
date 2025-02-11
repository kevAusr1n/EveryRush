import { ReactNode, useEffect, useRef, useState } from "react";
import { isUserLoggedIn } from "../functions/UserUtils";
import { createSearchParams, useNavigate } from "react-router";
import axios from "axios";

function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any>([]);
    const [size, setSize]  = useState(10);
    const [page, setPage] = useState(1);
    
    const totalCount = useRef(0);
    const totalPages = useRef(0);

    const [INITIATE, ACCEPTED, REFUSED, IN_PROCESS, CR_IN_PROCESS, CR_REFUSED, CR_ACCEPTED, FINISHED] 
        = [0, 1, 2, 3, 4, 5, 6, 7];

    const doFreeCancel = () => {}

    const doCancelRequest = () => {}

    const doRefundReuqest = () => {}

    const doDisplayOrdersIfThereIs = () : ReactNode => {
        if (orders.length > 0){
            return (
                <>
                    <div className="flex items-center justify-center">
                        <h1>orders</h1>
                        <p>Here are your orders:</p>
                    </div>
                    {orders.map((order: any) => {
                        const cancelOrRefund = () => {};

                        return (
                            <div>
                                <p>{order.id}</p>
                                <p>{order.status}</p>
                                {
                                    order.productSnapshots.map(
                                        (snapshot: any) => {
                                            return (
                                                <>
                                                    <p>{snapshot.name}</p>
                                                    <p>{snapshot.price}</p>
                                                    <p>Qty: {snapshot.quantity}</p>
                                                    <line></line>
                                                </>    
                                            )
                                        }
                                    )
                                }
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                                    focus:outline-none focus:shadow-outline" 
                                    onClick={() => navigate({pathname: `/orders/detail/${order.id}`})}>
                                    DETAIL
                                </button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                                    focus:outline-none focus:shadow-outline">
                                    
                                </button>
                            </div>
                        )
                    })}
                </>
            )
        } else {
            return <p>There is no contact.</p>
        }
    }

    const doDisplayOrderPage = () : ReactNode => {
        if (!isUserLoggedIn()){
            return (
                <>
                    <p>Please sign in to manage your orders.</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                        focus:outline-none focus:shadow-outline" onClick={() => navigate("/signin")}>
                            SIGN IN
                    </button>
                </>
            )
        }
        else {
            useEffect(() => {
                axios
                .get(`http://localhost:5175/api/orders?userid=${localStorage.getItem("userid")}`, {
                    headers: {
                        Accept: 'application/json'
                    }
                })
                .then((response) => {
                    setOrders(response.data.orders);
                })
                .catch((error) => {console.log(error);})
            }, [])

            return (
                <>
                    {doDisplayOrdersIfThereIs()}
                </>
            )
        }
    }

    return (
        <div className="flex m-20 items-center justify-center">
            {doDisplayOrderPage()}
        </div>
    )
}

export default Orders;