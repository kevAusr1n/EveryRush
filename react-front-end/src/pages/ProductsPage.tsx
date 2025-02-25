import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { deleteProducts, getPaginatedProducts, updateProductStatus } from "../functions/ProductFunction";
import ProductBriefPage from "./ProductBriefPage";
import DisplayArrangement from "../components/DisplayArrangement";
import { GetProductsResponse } from "../type/ResponseType";
import { Product } from "../type/EntityType";
import FilterSide from "../components/FilterSide";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { isUserCustomerOrGuest } from "../functions/UserFunction";
import { BlackButton, RedButton } from "../components/Button";
import { useNavigate } from "react-router";
import ProductStatusConfig from "../config/ProductStatusConfig";

function ProductsPage() {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [size, setSize]  = useState(5);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [orderTerm, setOrderTerm] = useState("Popularity");
    const initialArrangement = "grid grid-cols-4";
    const [arrangement, setArrangement] = useState<string>(initialArrangement);
    const [response, setResponse] = useState<GetProductsResponse>({products: [], totalPages: 0, totalCount: 0});

    useEffect(() => getPaginatedProducts({
        page : page, 
        size : size, 
        searchTerm : searchTerm, 
        orderTerm : orderTerm,
        setResponse: setResponse,
    }), [page, size, searchTerm, orderTerm, refresh]);

    const updateProductStatusHandler = async (id: string, status: number) => {
        await updateProductStatus({id: id, status: status});
        setRefresh(!refresh);
    }

    const deleteProductHandler = async (id: string) => {
        await deleteProducts({id: id});
        setRefresh(!refresh);
    }

    return (
        (
            isUserCustomerOrGuest() && 
            <ResponsiveDiv style="" children={[
                <ResponsiveDiv style="flex flex-row" children={[
                    <ResponsiveDiv style="w-1/5" key={crypto.randomUUID()} children={[
                        <ResponsiveDiv style="mt-20 mb-20 ml-5 py-10 flex flex-col items-center bg-white shadow-xl" children={[
                            <ResponsiveDiv style="ml-5 mr-5" children={[
                                <FilterSide 
                                    orderTerms={["Popularity", "Price Ascending", "Price Descending", "Newest Product", "Oldest Product"]}
                                    setOrderTerm={setOrderTerm}
                                    setArrangement={setArrangement}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                />
                            ]} />
                        ]} />
                    ]} />,
                    <ResponsiveDiv style="mt-20 mb-20 m-5 mr-5 w-4/5" key={crypto.randomUUID()} children={[   
                        <DisplayArrangement 
                            arrangement={arrangement}
                            exhibitedChildren={
                                response.products.map((product: Product, index: number) => {
                                    const display = arrangement == initialArrangement ? "grid" : "row";
                                    return (<ProductBriefPage key={index.toString()} display={display} product={product}/>)
                                })
                            }
                        />
                    ]} />
                ]}/>,
                <Pagination 
                    size={size}
                    setSize={setSize}
                    page={page}
                    setPage={setPage}
                    totalPages={response.totalPages}
                    totalCount={response.totalCount} 
                />
            ]}/>
        ) || 
        <ResponsiveDiv style="mt-20 mb-20 m-5 mr-5 w" key={crypto.randomUUID()} children={[ 
            <ResponsiveDiv style="flex flex-col items-start gap-3" children={[
                <BlackButton buttonName="ADD PRODUCT" size="w-40 h-10" clickHandler={() => navigate("/products/add")} />, 
                response.products.length == 0 && <ResponsiveDiv style="w-full flex flex-row mt-20 justify-center" children={[
                    <p className="text-xl">You have no product</p>
                ]} />,

                response.products.length != 0 && <ResponsiveDiv style="w-full flex flex-row items-center border-b-1" children={[
                    <p className="w-3/12" key={0}>Product ID</p>,
                    <p className="w-3/12 font-bold" key={1}>Name</p>,
                    <p className="w-1/12 font-bold" key={2}>Price</p>,
                    <p className="w-1/12 font-bold" key={3}>Stock</p>,
                    <p className="w-1/12 font-bold" key={4}>Status</p>
                ]} />,
                response.products.length != 0 && response.products.map((product: Product) => {
                    return (
                        <ResponsiveDiv style="w-full flex flex-row shadow-xl items-center" children={[
                            <p className="w-3/12" key={0}>{product.id}</p>,
                            <p className="w-3/12" key={1}>{product.name}</p>,
                            <p className="w-1/12" key={2}>${product.price}</p>,
                            <p className="w-1/12" key={3}>{product.stock}</p>,
                            <p className="w-1/12" key={4}>{ProductStatusConfig.getStatusName(product.status)}</p>,
                            <ResponsiveDiv style="flex flex-row gap-5 py-3" children={[
                                product.status == ProductStatusConfig.OFF_SHELF && <BlackButton buttonName="ON-SHELF" size="w-40 h-10" clickHandler={() => {
                                    updateProductStatusHandler(product.id, ProductStatusConfig.IN_SALE);
                                }} />,
                                product.status != ProductStatusConfig.OFF_SHELF && <BlackButton buttonName="OFF-SHELF" size="w-40 h-10" clickHandler={() => {
                                    updateProductStatusHandler(product.id, ProductStatusConfig.OFF_SHELF);
                                }} />,
                                <RedButton buttonName="DELETE" size="w-40 h-10" clickHandler={() => {
                                    deleteProductHandler(product.id);
                                }} />
                            ]} />
                        ]} />
                    )
                })
                
            ]} />,
            response.products.length != 0 && <Pagination 
                size={size}
                setSize={setSize}
                page={page}
                setPage={setPage}
                totalPages={response.totalPages}
                totalCount={response.totalCount} 
            />
        ]} />
    )
}

export default ProductsPage;