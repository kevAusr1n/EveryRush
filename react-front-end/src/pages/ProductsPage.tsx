import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { GetPaginatedProducts } from "../functions/ProductFunction";
import ProductBriefPage from "./ProductBriefPage";
import DisplayArrangement from "../components/DisplayArrangement";
import { GetProductsResponse } from "../type/ResponseType";
import { Product } from "../type/EntityType";
import FilterSide from "../components/FilterSide";
import ResponsiveDiv from "../components/div/ResponsiveDiv";

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
        <ResponsiveDiv style="" children={[
            <ResponsiveDiv style="flex flex-row" children={[
                <ResponsiveDiv style="bg-gray-200 w-1/5" key={crypto.randomUUID()} children={[
                    <ResponsiveDiv style="mt-20 mb-20 ml-5 py-10 flex flex-col items-center bg-white shadow" children={[
                        <ResponsiveDiv style="mb-5" children={[
                            <SearchBar 
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                        ]} />,
                        <ResponsiveDiv style="ml-5 mr-5" children={[
                            <FilterSide 
                                orderTerms={["Popularity", "Price Ascending", "Price Descending", "Newest Product", "Oldest Product"]}
                                setOrderTerm={setOrderTerm}
                                setArrangement={setArrangement}
                            />
                        ]} />
                    ]} />
                ]} />,
                <ResponsiveDiv style="mt-20 mb-20 m-5 mr-5 w-4/5 bg-white shadow" key={crypto.randomUUID()} children={[   
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
    )
}

export default ProductsPage;