import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CartItem, Product } from "../type/ObjectType";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { ImageBrief, ImageExhibition } from "../components/Image";
import { imageRoot } from "../config/BackendServerConfig";
import { BlackButton } from "../components/Button";
import { addOrUpdateCartItem } from "../functions/CartFunction";
import { isUserCustomerOrGuest, isUserSignedIn } from "../functions/UserFunction";
import { MonoStyleText } from "../components/Text";
import { GetReviewsResponse } from "../type/ResponseType";
import { getPaginatedReviews } from "../functions/ProductReviewFunction";
import { getProductDetail } from "../functions/ProductFunction";
import Pagination from "../components/Pagination";
import { isStringEmpty } from "../functions/Utils";
import ReviewBoxPage from "./ReviewBoxPage";

function ProductDetailPage() {
    const navigate = useNavigate();
    const params = useParams();
    const [size, setSize]  = useState(5);
    const [page, setPage] = useState(1);
    const productId = params.id as string;
    const [product, setProduct] = useState<Product>({id: "", userId: "", userName: "", name: "", price: 0, description: "", stock: 0, imageUrl: ""} as Product);
    const [reviewResponse, setReviewResponse] = useState<GetReviewsResponse>({reviews: [], totalCount: 0, totalPages: 0});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getProduct = async () => {
        setProduct(await getProductDetail({id: productId}));
        setReviewResponse(await getPaginatedReviews({productId: productId, page: page, size: size}));
    }

    const clickImageHandler = (index: number) => {
        return {
            onClick: () => setCurrentImageIndex(index)
        }
    }

    useEffect(() => {getProduct()}, []);

    return (
        <ResponsiveDiv style="mt-20 mb-20 gap-5 p-20" children={<>
            <ResponsiveDiv style="flex flex-col xl:flex-row gap-20 " children={<>
                <ResponsiveDiv style="flex flex-col gap-16 w-full xl:w-3/8 items-center" children={<>
                    {!isStringEmpty(product.imageUrl) && <ImageBrief src={(product.imageUrl as string).split(",").map((image: string) => imageRoot + image)[currentImageIndex]} style="w-108 h-108 p-5"/>}
                    {!isStringEmpty(product.imageUrl) && <ImageExhibition 
                        srcList={(product.imageUrl as string).split(",").map((image: string) => imageRoot + image)} 
                        style="w-16 h-16 p-2 shadow" 
                        currentImageIndex={currentImageIndex} 
                        setCurrentImageIndex={setCurrentImageIndex}
                        eventHandlerMap={clickImageHandler} 
                    />}
                </>} />
                <ResponsiveDiv style="flex flex-col px-10 py-10 gap-5 w-full xl:w-3/4" children={<>
                    <ResponsiveDiv style="flex flex-col items-center xl:items-start gap-10 h-full" children={<>
                        <ResponsiveDiv style="flex flex-col xl:flex-row items-center gap-10" children={<>
                            <MonoStyleText style="text-3xl font-bold" content={product.name} />
                            <span className="ml-5 px-3 py-2 text-black border-3 rounded-lg text-5xl font-normal">${product.price}</span>
                        </>} />
                        <MonoStyleText style="text-gray-500 text-xl" content={product.description} />
                    </>} />
                    <ResponsiveDiv style="flex flex-col xl:flex-row items-center justify-end gap-5 mt-20" children={<> 
                        {isUserCustomerOrGuest() && <BlackButton key={crypto.randomUUID()} buttonName="ADD TO CART" size="w-50 h-10" clickHandler={() => 
                            {
                                if (!isUserSignedIn()) {
                                    navigate("/signin");
                                } else {
                                    addOrUpdateCartItem({item: { productId: productId, quantity: 1} as CartItem})
                                }
                            }
                        } />}
                        {isUserCustomerOrGuest() && <BlackButton buttonName={"CHAT WITH SELLER"} size="w-50 h-10" clickHandler={() => 
                            {
                                if (!isUserSignedIn()) {
                                    navigate("/signin");
                                } else {
                                    navigate(`/chat?touserid=${product.userId}&tousername=${product.userName}`);
                                }
                            }
                        } />}
                        <BlackButton buttonName="BACK" size="w-50 h-10" clickHandler={() => {navigate('/products')}} />
                    </>} />
                </>} />
            </>} />
            <ResponsiveDiv style="flex flex-col gap-5" children={<>
                <ResponsiveDiv style="mt-20" children={<>
                    <MonoStyleText style="text-6xl font-bold bg-black text-white p-2" content="REVIEWS" />
                 </>} />
            </>} />
            {reviewResponse.reviews.length == 0 && <ResponsiveDiv style="flex flex-row justify-center items-center mt-20" children={<>
                <MonoStyleText style="text-xl" content="This product has no review." />
            </>} />}
            {reviewResponse.reviews.length != 0 && reviewResponse.reviews.map((review, index) => {
                return  <ReviewBoxPage key={index} review={review} product={product} />
            })}
            {reviewResponse.reviews.length != 0 && <Pagination 
                size={size}
                setSize={setSize}
                page={page}
                setPage={setPage}
                totalPages={reviewResponse.totalPages}
                totalCount={reviewResponse.totalCount} 
            />}
        </>} />
    )
}

export default ProductDetailPage;