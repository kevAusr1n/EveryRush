import { useNavigate } from "react-router";
import { BlackButton, WhiteButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { ImageBrief } from "../components/Image";
import { backServerEndpoint } from "../config/BackendServerConfig";
import { addOrUpdateCartItem } from "../functions/CartFunction";
import { CartItem, Product } from "../type/EntityType";
import { ReactNode } from "react";
import { isStringEmpty } from "../functions/Utils";
import { isUserSignedIn } from "../functions/UserFunction";

const productBoxGridStyle = "gap-5 m-5 p-5 bg-white flex flex-col items-center shadow-xl transition hover:scale-105";
const productBoxRowStyle="gap-5 m-5 p-5 bg-white flex flex-row justify-between shadow-xl transition hover:scale-101";

function ProductBriefPage(props: {product : Product, display: string}) 
{    
    const navigate = useNavigate();
    const goToDetailPage = () => {
        navigate(`/product/${props.product.id}`)
    }
    
    const descriptionTrim = (description : string, productId: string) : ReactNode => {
        if (isStringEmpty(description))  {
            return <></>;
        }
        
        const words: string[] = description.split(" ");
        if (words.length > 40) {
            return <p className="text-gray-500">{words.slice(0, 40).join(" ") + " ... "}<a className="text-blue-500 underline" href={`/product/${productId}`}>detail</a></p>
        }

        return <p>{description}</p>;
    }

    switch(props.display) {
        case "grid":
            return (
                <ResponsiveDiv style={productBoxGridStyle} children={[
                    props.product.imageUrl && <ImageBrief src={new URL((props.product.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32" />,
                    <strong className="h-1/5">{props.product.name}</strong>,
                    <p className="h-1/5">PRICE: ${props.product.price}</p>,
                    <p className="h-1/5">STOCK: {props.product.stock}</p>,
                    <BlackButton buttonName="ADD TO CART" size="w-40 h-10" clickHandler={() => {
                        if (!isUserSignedIn()) {
                            navigate("/signin");
                        } else {
                            addOrUpdateCartItem({item: { productId: props.product.id, quantity: 1} as CartItem})
                        }
                    }} />,
                    <WhiteButton buttonName="DETAIL" size="w-40 h-10" clickHandler={() => goToDetailPage()} />
                ]} />    
            )
        case "row":
            return (
                <ResponsiveDiv style={productBoxRowStyle} children={[
                    <ResponsiveDiv style="flex flex-row w-4/5" children={[   
                        <ResponsiveDiv style="w-1/6" children={[    
                            props.product.imageUrl && <ImageBrief src={new URL((props.product.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32" />,
                        ]} />, 
                        <ResponsiveDiv style="flex flex-col gap-5 w-5/6" children={[  
                            <strong className="text-xl">{props.product.name}</strong>,
                            descriptionTrim(props.product.description, props.product.id)
                        ]} />
                    ]} />,
                    <ResponsiveDiv style="flex flex-col gap-1 w-1/5" children={[    
                        <p>PRICE: ${props.product.price}</p>,
                        <p>STOCK: {props.product.stock}</p>,
                        <BlackButton buttonName="ADD TO CART" size="w-40 h-10" clickHandler={() => {
                            if (!isUserSignedIn()) {
                                navigate("/signin");
                            } else {
                                addOrUpdateCartItem({item: { productId: props.product.id, quantity: 1} as CartItem})
                            }
                        }} />,
                        <WhiteButton buttonName="DETAIL" size="w-40 h-10" clickHandler={() => goToDetailPage()} />
                    ]} />
                ]} />    
            )
        default:
            return (
                <ResponsiveDiv style={productBoxGridStyle} children={[
                    props.product.imageUrl && <ImageBrief src={new URL((props.product.imageUrl as string).split(",")[0], backServerEndpoint).toString()} style="w-32 h-32" />,
                    <strong>{props.product.name}</strong>,
                    <p>PRICE: ${props.product.price}</p>,
                    <p>STOCK: {props.product.stock}</p>,
                    <BlackButton buttonName="ADD TO CART" size="w-40 h-10" clickHandler={() => {
                        if (!isUserSignedIn()) {
                            navigate("/signin");
                        } else {
                            addOrUpdateCartItem({item: { productId: props.product.id, quantity: 1} as CartItem})
                        }
                    }} />,
                    <WhiteButton buttonName="DETAIL" size="w-40 h-10" clickHandler={() => goToDetailPage()} />
                ]} />    
            )

    }
}

export default ProductBriefPage;