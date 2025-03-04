import { Dispatch, SetStateAction } from "react";
import APICall from "../config/ApiConfig";
import { Order } from "../type/ObjectType";
import { isStringEmpty } from "./Utils";

async function getPaginatedOrders(props: {
    page: number,
    size: number,
    searchTerm: string, 
    status: string,
    setResponse: Dispatch<SetStateAction<any>>
}) {
    var requestUrl = `/api/orders?userid=${localStorage.getItem("userid")}&page=${props.page}&size=${props.size}`;
    if (!isStringEmpty(props.searchTerm)) {
        requestUrl += `&searchTerm=${props.searchTerm}`;
    }
    if (!isStringEmpty(props.status)) {
        requestUrl += `&status=${props.status}`;
    }
    await APICall().get(requestUrl)
        .then((response) => {
            props.setResponse(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
}

async function placeOrder(props: {orders: Order[]}) {
    var request = {
        orders: [] as any[]
    }
    for (var i = 0; i < props.orders.length; i++) {
        request.orders.push({
            userId: props.orders[i].buyerId,
            fullName: props.orders[i].fullName,
            email: props.orders[i].email,
            phone: props.orders[i].phone,
            address: props.orders[i].address,
            purchaseProducts: []
        })
        for (var j = 0; j < props.orders[i].purchaseProducts.length; j++) {
            request.orders[i].purchaseProducts.push({
                Id: props.orders[i].purchaseProducts[j].productId,
                quantity: props.orders[i].purchaseProducts[j].quantity
            })
        }
    }
    await APICall().post('/api/orders/place', request)
}

export { placeOrder, getPaginatedOrders };