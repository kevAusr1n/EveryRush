import { CartItem, Product } from "../type/EntityType";
import { isStringEmpty } from "./Utils";

function addToCart(props: {item: Product | CartItem, quantity: number}): boolean {
    let thisCartItem = {
        id: props.item.id,
        productId: props.item.id,
        name: props.item.name,
        price: props.item.price,
        imageUrl: props.item.imageUrl,
        quantity: props.quantity
    }

    const key = "cart";
    let cart = sessionStorage.getItem(key) as string;

    if (!isStringEmpty(cart)) {
        let cartJson = JSON.parse(cart);
        const index = cartJson.cartItems.findIndex((cartItem: any)=> cartItem.productId === thisCartItem.productId);

        if (index == -1) {
            cartJson.cartItems.push(thisCartItem);
        } else {
            cartJson.cartItems[index].quantity = cartJson.cartItems[index].quantity + thisCartItem.quantity;
        }

        sessionStorage.setItem(key, JSON.stringify(cartJson));
    } else {
        let productsInCartJson = { cartItems: [thisCartItem] };
        sessionStorage.setItem(key, JSON.stringify(productsInCartJson));
    }

    /*if (isUserSignedIn()) {

    } else {
        let productsInCartJson = { cartItems: [thisCartItem] };
        sessionStorage.setItem(key, JSON.stringify(productsInCartJson));
    }*/

    return true;
}

function removeFromCart (props: {cartItem: any}) : boolean {
    let cartJson = JSON.parse(sessionStorage.getItem("cart") as string);
    cartJson.cartItems = cartJson.cartItems.filter((cartItem : CartItem) => cartItem.productId != props.cartItem.productId);
    
    if (cartJson.cartItems.length == 0) {
        sessionStorage.removeItem("cart");
    } else {
        sessionStorage.setItem("cart", JSON.stringify({cartItems: cartJson.cartItems }));
    }

    return true;
}

export { addToCart, removeFromCart }