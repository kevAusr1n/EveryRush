import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { GetPaginatedProducts } from "../functions/ProductFunction";
import ProductBriefPage from "./ProductBriefPage";
import DisplayArrangement from "../components/DisplayArrangement";
import { GetProductsResponse } from "../type/ResponseType";
import { Product } from "../type/EntityType";

function ProductsPage() {
    const [size, setSize]  = useState(5);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [orderTerm, setOrderTerm] = useState("Popularity");
    const [response, setResponse] = useState<GetProductsResponse>({products: [], totalPages: 0, totalCount: 0});

    useEffect(() => GetPaginatedProducts({
        page : page, 
        size : size, 
        searchTerm : searchTerm, 
        orderTerm : orderTerm,
        setResponse: setResponse,
    }), [page, size, searchTerm, orderTerm]);

    return (
        <>  
            <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                orderTerm={orderTerm}
                setOrderTerm={setOrderTerm}
            /> 
            <DisplayArrangement
                initial_arrangement={"grid"}
                exhibitedChildren={
                    response.products.map((product: Product, index: number) => {
                        return (<ProductBriefPage key={index.toString()} product={product}/>)
                    })
                }
            />
            <Pagination 
                size={size}
                setSize={setSize}
                page={page}
                setPage={setPage}
                totalPages={response.totalPages}
                totalCount={response.totalCount}
            />
        </>
    )
}

export default ProductsPage;