import APICall from "../config/ApiConfig";
import { CartItem } from "../type/ObjectType";
import { isStringEmpty } from "./Utils";

async function getCartItem(props: {userId : string}) : Promise<CartItem[]> {
    var cartResponse: CartItem[] = [];
    await APICall()
    .get(`/api/cart?userid=${props.userId}`)
    .then((res) => {
        cartResponse = res.data.cartItems;
    })
    .catch((error) => {
        console.log(error);
    });
    return cartResponse;
}

async function addOrUpdateCartItem(props: {item: CartItem}) {
    let thisCartItem = {
        id: props.item.id,
        userId: localStorage.getItem("userid") as string,
        productId: props.item.productId,
        quantity: props.item.quantity
    }

    let action: string = isStringEmpty(props.item.id) ? "add" : "update";

    await APICall()
    .post(`/api/cart/${action}` , thisCartItem)
    .then((_) => {})
    .catch((error) => {
        console.log(error);
    });
}

async function removeFromCart (props: {id: string}) {
    await APICall()
    .delete(`/api/cart/delete/${props.id}`)
    .then((_) => {})
    .catch((error) => {
        console.log(error);
    });
}

export { getCartItem, addOrUpdateCartItem, removeFromCart }