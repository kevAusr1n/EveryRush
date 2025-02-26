import { Dispatch, SetStateAction } from "react";
import APICall from "../config/ApiConfig";
import { CartItem } from "../type/EntityType";
import { isStringEmpty } from "./Utils";

function getCart(props: {userId : string, setCart: Dispatch<SetStateAction<CartItem[]>>}) {
    APICall()
    .get(`/api/cart?userid=${props.userId}`)
    .then((res) => {
        props.setCart(res.data.cartItems);
    })
    .catch((error) => {
        console.log(error);
    });
}

function addOrUpdateCartItem(props: {item: CartItem}) {
    let thisCartItem = {
        id: props.item.id,
        userId: localStorage.getItem("userid") as string,
        productId: props.item.productId,
        quantity: props.item.quantity
    }

    let action: string = isStringEmpty(props.item.id) ? "add" : "update";

    APICall()
    .post(`/api/cart/${action}` , thisCartItem)
    .then((_) => {})
    .catch((error) => {
        console.log(error);
    });
}

function removeFromCart (props: {id: string}) {
    APICall()
    .delete(`/api/cart/delete/${props.id}`)
    .then((_) => {})
    .catch((error) => {
        console.log(error);
    });
}

export { getCart, addOrUpdateCartItem, removeFromCart }