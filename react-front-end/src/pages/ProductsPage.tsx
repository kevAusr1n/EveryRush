import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { getPaginatedProducts } from "../functions/ProductFunction";
import ProductBriefPage from "./ProductBriefPage";
import DisplayArrangement from "../components/DisplayArrangement";
import { GetProductsResponse } from "../type/ResponseType";
import { Product } from "../type/EntityType";
import FilterSide from "../components/FilterSide";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { isUserCustomerOrGuest } from "../functions/UserFunction";
import { BlackButton } from "../components/Button";
import { useNavigate } from "react-router";
import ProductUpdateblePage from "./ProductUpdateblePage";

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
                response.products.length == 0 && <ResponsiveDiv style="w-full flex flex-col items-center gap-5" children={[
                    <p key={crypto.randomUUID()} className="text-xl">Your have no product</p>,
                    <BlackButton key={crypto.randomUUID()} buttonName="ADD PRODUCT" size="w-40 h-10" clickHandler={() => navigate("/products/add")} />
                ]} />,
                response.products.length != 0 && <ResponsiveDiv style="mb-5" children={[
                    <BlackButton key={crypto.randomUUID()} buttonName="ADD PRODUCT" size="w-40 h-10" clickHandler={() => navigate("/products/add")} />
                ]} />,
                response.products.length != 0 && <ResponsiveDiv style="px-2 w-full flex flex-row items-center border-b-1" children={[
                    <p className="w-3/13 font-bold" key={0}>Product ID</p>,
                    <p className="w-3/13 font-bold" key={1}>Name</p>,
                    <p className="w-1/13 font-bold" key={2}>Price</p>,
                    <p className="w-2/13 font-bold" key={3}>Stock</p>,
                    <p className="w-1/13 font-bold" key={4}>Status</p>
                ]} />,
                response.products.length != 0 && response.products.map((product: Product) => {
                    return (                   
                        <ProductUpdateblePage key={product.id} product={product} refresh={refresh} setRefresh={setRefresh} />         
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