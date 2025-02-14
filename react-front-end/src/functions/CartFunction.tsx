import { ProductEntity } from "../type/EntityType";
import { isUserSignedIn } from "./UserFunction";
import { isStringEmpty } from "./Utils";

function addToCart(props: {product: ProductEntity, quantity: number}): boolean {
    let thisProduct = {
        id: props.product.id,
        name: props.product.name,
        price: props.product.price,
        quantity: props.quantity
    }

    let productsInCart = sessionStorage.getItem("cart") as string;

    if (!isStringEmpty(productsInCart)) {
        let productsInCartJson = JSON.parse(productsInCart);
        for (var index in productsInCartJson.products) {
            if (productsInCartJson.products[index].id == thisProduct.id) {
                productsInCartJson.products[index].quantity = productsInCartJson.products[index].quantity + props.quantity;
                sessionStorage.setItem("cart", JSON.stringify(productsInCartJson));
                break;
            }
        }
        productsInCartJson.products.push(thisProduct);
        sessionStorage.setItem("cart", JSON.stringify(productsInCartJson));
    }

    if (isUserSignedIn()) {
        let productsInCartJson = JSON.parse(productsInCart);
        for (var index in productsInCartJson.products) {
            
        }
    } else {
        let productsInCartJson = { products: [thisProduct] };
        sessionStorage.setItem("cart", JSON.stringify(productsInCartJson));
    }
}

export { addToCart }