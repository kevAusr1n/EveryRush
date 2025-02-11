import { ReactNode, useEffect, useRef, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import ProductBox from "./ProductBox";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router";

function Products() {
    const navigate = useNavigate();

    const [size, setSize]  = useState(10);
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState<any>([]);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [orderTerm, setOrderTerm] = useState("Popularity");

    const totalCount = useRef(0);
    const totalPages = useRef(0);

    useEffect(() => {
        let orderBy = "";
        let order = "";

        if (orderTerm === "Popularity") {
            orderBy = "";
            order = "";
        }
        else if (orderTerm === "Price Asceding") {
            orderBy = "price";
            order = "asc";
        }
        else if (orderTerm === "Price Descending") {
            orderBy = "price";
            order = "desc";
        }
        else if (orderTerm === "Oldest Product") {
            orderBy = "time";
            order = "asc";
        }
        else if (orderTerm === "Newest Product") {
            orderBy = "time";
            order = "desc";
        }
        
        let query : string = `page=${page}&size=${size}`;

        if (searchTerm != undefined && searchTerm != null && searchTerm != '') {
            query += `&keyword=${searchTerm}`;
        }
        if (orderBy != undefined && orderBy != null && orderBy != '') {
            query += `&orderby=${orderBy}`;
        }
        if (order != undefined && order != null && order != '') {
            query += `&order=${order}`;
        }

        axios
            .get(`http://localhost:5175/api/products?${query}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                setProducts(res.data.products);
                totalCount.current = res.data.totoalCount;
                totalPages.current = res.data.totalPages;
            })
            .catch((err) => console.log(err));

    }, [searchTerm, orderTerm, page, size]);

    const doDisplayAddProductButtonIfBusinessOwnerLoggedIn = () : ReactNode => {
        return (
            <button onClick={() => navigate("/products/add")}>
                ADD PRODUCT
            </button>
        )
    }

    return (
        <>  
            <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                orderTerm={orderTerm}
                setOrderTerm={setOrderTerm}
            /> 
            {doDisplayAddProductButtonIfBusinessOwnerLoggedIn()}
            <div className="flex m-20">
                {products.map((product : any) => {
                    return <ProductBox 
                        product={product}/>
                })}
            </div>
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