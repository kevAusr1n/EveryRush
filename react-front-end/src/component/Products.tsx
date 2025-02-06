import { useEffect, useState } from "react";
import LogIn from "./LogIn";
import axios from "axios";
import Pagination from "./Pagination";

function Products() {
    /*
    useEffect(() => {
        axios
            .post(`http://localhost:5175/api/products/market?`, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                sessionStorage.setItem("email", res.data.email);
            })
            .catch((err) => console.log(err));
    }, [])*/

    return (
        <Pagination totalCount={225}/>
    )
}

export default Products;