import { BasicButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import ImageBrief from "../components/ImageBrief";
import { backServerEndpoint } from "../config/BackendServerConfig";
import { addToCart } from "../functions/CartFunction";
import { Product } from "../type/EntityType";

function ProductBriefPage(props: {product : Product, display: string}) 
{    
    switch(props.display) {
        case "grid":
            return (
                <ResponsiveDiv style="gap-5 m-5 p-5 bg-white flex flex-col items-center shadow" children={[
                    props.product.imageUrl && <ImageBrief src={new URL((props.product.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32"/>,
                    <strong>{props.product.name}</strong>,
                    <p>price: ${props.product.price}</p>,
                    <p>stock: {props.product.stock}</p>,
                    <BasicButton buttonColor="bg-blue-500" textColor="text-white" buttonName="ADD TO CART" clickHandler={() => addToCart({item: props.product, quantity: 1})} />,
                    <BasicButton buttonColor="bg-white" textColor="text-blue-500" borderColor="border-gary-200" buttonName="PURCHASE" clickHandler={() => {}} />,
                ]} />    
            )
        case "row":
            return (
                <ResponsiveDiv style="gap-5 m-5 p-5 bg-white flex flex-row items-center justify-between shadow" children={[
                    <ResponsiveDiv style="" children={[    
                        props.product.imageUrl && <ImageBrief src={new URL((props.product.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32"/>
                    ]} />, 
                    <ResponsiveDiv style="flex flex-col gap-1" children={[    
                        <strong>{props.product.name}</strong>,
                        <p>price: ${props.product.price}</p>,
                        <p>stock: {props.product.stock}</p>,
                        <BasicButton buttonColor="bg-blue-500" textColor="text-white" buttonName="ADD TO CART" clickHandler={() => addToCart({item: props.product, quantity: 1})} />,
                        <BasicButton buttonColor="bg-white" textColor="text-blue-500" borderColor="border-gary-200" buttonName="PURCHASE" clickHandler={() => {}} />
                    ]} />
                ]} />    
            )
        default:
            return (
                <ResponsiveDiv style="gap-5 m-5 p-5 bg-white flex flex-col items-center shadow" children={[
                    props.product.imageUrl && <ImageBrief src={new URL((props.product.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32"/>,
                    <strong>{props.product.name}</strong>,
                    <p>price: ${props.product.price}</p>,
                    <p>stock: {props.product.stock}</p>,
                    <BasicButton buttonColor="bg-blue-500" textColor="text-white" buttonName="ADD TO CART" clickHandler={() => addToCart({item: props.product, quantity: 1})} />,
                    <BasicButton buttonColor="bg-white" textColor="text-blue-500" borderColor="border-gary-200" buttonName="PURCHASE" clickHandler={() => {}} />,
                ]} />    
            )

    }
}

export default ProductBriefPage;