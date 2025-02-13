import axios from "axios";
import { useEffect, useState } from "react";

function ProductDetail() {
    const [_, setProduct] = useState<any>([]);

    useEffect(() => {
        axios
            .get(`http://localhost:5175/api/products/market?`, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                setProduct(res.data.product);
            })
            .catch((err) => console.log(err));

    }, []); 

    return (
        <>
        </>
    )
}

export default ProductDetail;