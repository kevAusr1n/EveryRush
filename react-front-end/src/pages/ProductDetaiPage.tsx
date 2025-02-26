import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CartItem, Product } from "../type/EntityType";
import { GetProduct } from "../functions/ProductFunction";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { ImageBrief, ImageExhibition } from "../components/Image";
import { backServerEndpoint } from "../config/BackendServerConfig";
import { BlackButton, WhiteButton } from "../components/Button";
import { addOrUpdateCartItem } from "../functions/CartFunction";
import { isUserCustomerOrGuest, isUserSignedIn } from "../functions/UserFunction";

function ProductDetailPage() {
    const navigate = useNavigate();
    const params = useParams();
    const productId = params.id as string;
    const [product, setProduct] = useState<Product>({id: "", userId: "", name: "", price: 0, description: "", stock: 0, imageUrl: ""} as Product);

    let images: string[] = (product.imageUrl as string).split(",").map((image: string) => 
        new URL(image, backServerEndpoint).toString()
    );

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getProduct = async () => {
        await GetProduct({id: productId, setProduct: setProduct});
    }

    const clickImageHandler = (index: number) => {
        return {
            onClick: () => setCurrentImageIndex(index)
        }
    }

    useEffect(() => {getProduct()}, []);

    return (
        <ResponsiveDiv style="mt-20 mb-20 gap-5 p-20" children={[
            <ResponsiveDiv style="flex flex-row gap-20" children={[  
                <ResponsiveDiv style="flex flex-col gap-16 w-1/4" children={[
                    <ImageBrief src={new URL(images[currentImageIndex], backServerEndpoint).toString()} style="w-96 h-96"/>,
                    <ImageExhibition 
                        srcList={images} 
                        style="w-16 h-16 p-2 shadow" 
                        currentImageIndex={currentImageIndex} 
                        setCurrentImageIndex={setCurrentImageIndex}
                        eventHandlerMap={clickImageHandler} 
                    />,
                ]} />,
                <ResponsiveDiv style="flex flex-col px-10 py-10 gap-5 w-3/4" children={[
                    <ResponsiveDiv style="flex flex-col gap-10 h-full" children={[
                        <p className="text-3xl font-bold">{product.name} <span className="ml-5 px-3 py-2 text-black border-3 rounded-lg text-5xl font-normal">${product.price}</span></p>,
                        <p className="text-gray-500 text-xl">{product.description}</p>
                    ]} />,
                    <ResponsiveDiv style="flex flex-row items-center justify-end gap-5 mt-20" children={[  
                        isUserCustomerOrGuest() && <BlackButton buttonName="ADD TO CART" size="w-40 h-10" clickHandler={() => {() => 
                            {
                                if (!isUserSignedIn()) {
                                    navigate("/signin");
                                } else {
                                    addOrUpdateCartItem({item: { productId: productId, quantity: 1} as CartItem})
                                }
                            }
                        }} />,
                        <WhiteButton buttonName="BACK" size="w-40 h-10" clickHandler={() => {navigate('/products')}} />,
                    ]} />
                ]} />
            ]} />
        ]} />
    )
}

export default ProductDetailPage;