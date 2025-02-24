import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { GetPaginatedProducts } from "../functions/ProductFunction";
import ProductBriefPage from "./ProductBriefPage";
import DisplayArrangement from "../components/DisplayArrangement";
import { GetProductsResponse } from "../type/ResponseType";
import { Product } from "../type/EntityType";
import FilterSide from "../components/FilterSide";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { isUserCustomer } from "../functions/UserFunction";
import { BlackButton, RedButton } from "../components/Button";

function ProductsPage() {
    const [size, setSize]  = useState(5);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [orderTerm, setOrderTerm] = useState("Popularity");
    const initialArrangement = "grid grid-cols-4";
    const [arrangement, setArrangement] = useState<string>(initialArrangement);
    const [response, setResponse] = useState<GetProductsResponse>({products: [], totalPages: 0, totalCount: 0});

    useEffect(() => GetPaginatedProducts({
        page : page, 
        size : size, 
        searchTerm : searchTerm, 
        orderTerm : orderTerm,
        setResponse: setResponse,
    }), [page, size, searchTerm, orderTerm]);

    return (
        (
            isUserCustomer() && 
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
        (
            !isUserCustomer() && 
            <ResponsiveDiv style="mt-20 mb-20 m-5 mr-5 w" key={crypto.randomUUID()} children={[ 
                <ResponsiveDiv style="flex flex-col items-start gap-3" children={[
                    <BlackButton buttonName="ADD PRODUCT" size="w-40 h-10" clickHandler={() => {}} />,
                    <ResponsiveDiv style="w-full flex flex-row items-center border-b-1" children={[
                        <p className="w-3/10" key={0}>Product ID</p>,
                            <p className="w-3/10 font-bold" key={1}>Name</p>,
                            <p className="w-1/10 font-bold" key={2}>Price</p>,
                            <p className="w-1/10 font-bold" key={3}>Stock</p>,
                    ]} />,
                    response.products.map((product: Product, index: number) => {
                        return (
                            <ResponsiveDiv style="w-full flex flex-row shadow-xl items-center" children={[
                                <p className="w-3/10" key={index}>{product.id}</p>,
                                <p className="w-3/10" key={index}>{product.name}</p>,
                                <p className="w-1/10" key={index}>${product.price}</p>,
                                <p className="w-1/10" key={index}>{product.stock}</p>,
                                <ResponsiveDiv style="flex flex-row gap-5 py-3" children={[
                                    <BlackButton buttonName="OFF-SHELF" size="w-40 h-10" clickHandler={() => {}} />,
                                    <RedButton buttonName="DELETE" size="w-40 h-10" clickHandler={() => {
                                        
                                    }} />
                                ]} />
                            ]} />
                        )
                    })
                ]} />,
                <Pagination 
                    size={size}
                    setSize={setSize}
                    page={page}
                    setPage={setPage}
                    totalPages={response.totalPages}
                    totalCount={response.totalCount} 
                />
            ]} />
        )
    )
}

export default ProductsPage;