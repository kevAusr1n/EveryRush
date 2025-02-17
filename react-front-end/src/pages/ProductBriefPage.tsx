import { BasicButton } from "../components/Button";
import { backServerEndpoint } from "../config/BackendServerConfig";
import { addToCart } from "../functions/CartFunction";
import { Product } from "../type/EntityType";

function ProductBriefPage(props: {product : Product}) 
{    
    return (
        <div className="gap-5 m-5 p-5 bg-white flex flex-col items-center shadow">
            {props.product.imageUrl && <img src={new URL((props.product.imageUrl as string).split(",")[0], backServerEndpoint).toString()} className="img w-32 h-32"/>}
            <strong>{props.product.name}</strong>
            <p>price: ${props.product.price}</p>
            <p>stock: {props.product.stock}</p>
            <BasicButton buttonColor="blue-500" textColor="white" buttonName="ADD TO CART" clickHandler={() => addToCart({product: props.product, quantity: 1})} /> 
            <BasicButton buttonColor="white" textColor="blue-500" buttonName="PURCHASE" clickHandler={() => {}} />  
        </div>    
    )
}

export default ProductBriefPage;