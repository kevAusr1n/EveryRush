import APICall from "../config/ApiConfig";
import { Order } from "../type/EntityType";

async function placeOrder(props: {orders: Order[]}) {
    var request = {
        orders: []
    }
    for (var i = 0; i < props.orders.length; i++) {
        request.orders.push(props.orders[i])
    }
    await APICall().post('/api/order/place', request)
}

export { placeOrder };