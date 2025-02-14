import { Product } from "../type/EntityType";
import { isUserSignedIn } from "./UserFunction";
import { isStringEmpty } from "./Utils";

function addToCart(props: {product: Product, quantity: number}): boolean {
    let thisCartItem = {
        productId: props.product.id,
        name: props.product.name,
        price: props.product.price,
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

export { addToCart }