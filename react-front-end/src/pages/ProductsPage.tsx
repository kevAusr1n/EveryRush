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
        <ResponsiveDiv style="m-10 bg-white" children={[
            <ResponsiveDiv style="flex flex-row bg-white" children={[
                <ResponsiveDiv style="bg-white w-1/4" key={crypto.randomUUID()} children={[
                    <FilterSide 
                        orderTerms={["Popularity", "Price Ascending", "Price Desscending", "Newest Product", "Oldest Product"]}
                        setOrderTerm={setOrderTerm}
                        setArrangement={setArrangement}
                    />]}
                />,
                <ResponsiveDiv style="bg-white w-3/4" key={crypto.randomUUID()} children={[
                    <ResponsiveDiv style="flex flex-col bg-white" children={[
                        <ResponsiveDiv style="flex flex-row justify-center bg-white" children={[
                            <SearchBar 
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />, 
                        ]} />,
                        <ResponsiveDiv style="mt-10 bg-gray-200" children={[
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
                    ]} />,
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