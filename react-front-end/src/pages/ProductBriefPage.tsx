import { BasicButton } from "../components/Button";
import { addToCart } from "../functions/CartFunction";
import { Product } from "../type/EntityType";

function ProductBriefPage(props: {product : Product}) 
{     
    return (
        <div className="gap-5 border-1 m-5 p-5 flex flex-col items-center">
            <strong>{props.product.name}</strong>
            <p>price: ${props.product.price}</p>
            <p>stock: {props.product.stock}</p>
            <BasicButton color="black" buttonName="ADD TO CART" clickHandler={() => addToCart({product: props.product, quantity: 1})} /> 
            <BasicButton color="black" buttonName="PURCHASE" clickHandler={() => {}} />  
        </div>    
    )
}

export default ProductBriefPage;