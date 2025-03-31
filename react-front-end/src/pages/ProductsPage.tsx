import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { getPaginatedProducts } from "../functions/ProductFunction";
import ProductBriefPage from "./ProductBriefPage";
import DisplayArrangement from "../components/DisplayArrangement";
import { GetProductsResponse } from "../type/ResponseType";
import { Product } from "../type/ObjectType";
import FilterSide from "../components/FilterSide";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { isUserCustomerOrGuest } from "../functions/UserFunction";
import { BlackButton } from "../components/Button";
import { useNavigate } from "react-router";
import { MonoStyleText } from "../components/Text";
import ProductUpdatePage from "./ProductUpdatePage";

function ProductsPage() {
    const gridArrangement = "grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1";
    const rowArrangement = "grid grid-cols-1";

    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [size, setSize]  = useState(5);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [orderTerm, setOrderTerm] = useState("");
    const [selectedOrderTermIndex, setSelectedOrderTermIndex] = useState(-1);
    const [arrangementType, setArrangementType] = useState<string>("grid");
    const [response, setResponse] = useState<GetProductsResponse>({products: [], totalPages: 0, totalCount: 0});

    useEffect(() => getPaginatedProducts({
        page : page, 
        size : size, 
        searchTerm : searchTerm, 
        orderTerm : orderTerm,
        setResponse: setResponse
    }), [page, size, searchTerm, orderTerm, refresh]);

    return (
        (
            isUserCustomerOrGuest() && 
            <ResponsiveDiv style="" children={<>
                <ResponsiveDiv style="flex flex-row" children={<>
                    <ResponsiveDiv style={"invisible w-0 md:visible md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5"}  key={crypto.randomUUID()} children={<>
                        <ResponsiveDiv style="py-20 flex flex-col items-center bg-white h-full fixed" children={<>
                            <ResponsiveDiv style="ml-5" children={<>
                                <FilterSide 
                                    orderTerms={["Price Ascending", "Price Descending", "Newest Product", "Oldest Product"]}
                                    setOrderTerm={setOrderTerm}
                                    setArrangementType={setArrangementType}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    selectedOrderTermIndex={selectedOrderTermIndex}
                                    setSelectedOrderTermIndex={setSelectedOrderTermIndex}
                                />
                            </>} />
                        </>} />
                    </>} />
                    <ResponsiveDiv style={"mt-20 mb-20 " + arrangementType == "grid" ? "w-full lg:w-1/2 xl:w-2/3 2xl:w-4/5" : "w-full md:w-2/3 xl:w-4/5"} key={crypto.randomUUID()} children={<> 
                        <DisplayArrangement 
                            arrangement={arrangementType == "grid" ? gridArrangement : rowArrangement}
                            exhibitedChildren={
                                response.products.map((product: Product, index: number) => {
                                    return (<ProductBriefPage key={index.toString()} display={arrangementType} product={product}/>)
                                })
                            }
                        />
                    </>} />
                </>}/>
                <Pagination 
                    size={size}
                    setSize={setSize}
                    page={page}
                    setPage={setPage}
                    totalPages={response.totalPages}
                    totalCount={response.totalCount} 
                />
            </>} />
        ) || 
        <ResponsiveDiv style="mt-20 mb-20 m-5 mr-5 w" key={crypto.randomUUID()} children={<>
            <ResponsiveDiv style="flex flex-col items-start gap-3" children={<>
                {response.products.length == 0 && <ResponsiveDiv style="w-full flex flex-col items-center gap-5" children={<>
                    <MonoStyleText key={crypto.randomUUID()} style="text-xl" content="Your have no product" />
                    <BlackButton key={crypto.randomUUID()} buttonName="ADD PRODUCT" size="w-40 h-10" clickHandler={() => navigate("/products/add")} />
                </>} />}
                {response.products.length != 0 && <ResponsiveDiv style="mb-5" children={<>
                    <BlackButton key={crypto.randomUUID()} buttonName="ADD PRODUCT" size="w-40 h-10" clickHandler={() => navigate("/products/add")} />
                </>} />}
                {response.products.length != 0 && response.products.map((product: Product) => {
                    return (                   
                        <ProductUpdatePage key={product.id} product={product} refresh={refresh} setRefresh={setRefresh} />         
                    )
                })}
                
            </>} />
            {response.products.length != 0 && <Pagination 
                size={size}
                setSize={setSize}
                page={page}
                setPage={setPage}
                totalPages={response.totalPages}
                totalCount={response.totalCount} 
            />}
        </>} />
    )
}

export default ProductsPage;