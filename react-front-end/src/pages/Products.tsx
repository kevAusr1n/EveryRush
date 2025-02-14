import { ReactNode, useEffect, useRef, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import ProductBox from "./ProductBox";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router";
import { BasicButton } from "../components/Button";
import Exhibition from "../components/Exhibition";
import { GetPaginatedProducts } from "../functions/ProductFunction";

function Products() {
    const navigate = useNavigate();

    const [size, setSize]  = useState(10);
    const [page, setPage] = useState(1);
    const [response, setResponse] = useState<any>([]);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [orderTerm, setOrderTerm] = useState("Popularity");

    const totalCount = useRef(0);
    const totalPages = useRef(0);

    useEffect(() => GetPaginatedProducts({
        page : page, 
        size : size, 
        searchKey : 
        searchTerm, orderKey : orderTerm,
        setResponse: setResponse
    }), [searchTerm, orderTerm, page, size]);

    return (
        <>  
            <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                orderTerm={orderTerm}
                setOrderTerm={setOrderTerm}
            /> 
            <Exhibition
                arrangement="grid"
                items={products}
                itemComponent={ProductBox}
            />
            <Pagination 
                size={size}
                setSize={setSize}
                page={page}
                setPage={setPage}
                totalPage={totalPages.current}
                totalCount={totalCount.current} 
            />
        </>
    )
}

export default Products;