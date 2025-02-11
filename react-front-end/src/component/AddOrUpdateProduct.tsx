import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router";
import FormTable from "./FormTable";
import { useState } from "react";

function AddOrUpdateProduct() {
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();
    const [files, setFiles] = useState<File>();

    const navigate = useNavigate();
    
    const doAddOrUpdateProduct = (formData : FormData) => {
        var requestBody = {
            id: searchParams.get("id") as string,
            ownerId: localStorage.getItem('userid'),
            name: formData.get('name'),
            description: formData.get('description'),
            price: formData.get('price'),
            stock: formData.get('stock')
        }
        
        axios
            .post(`http://localhost:5175/api/products/${action}`, requestBody, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((_) => {
                navigate("/products");
            })
            .catch((error) => {console.log(error);})
    }

    const doBackToProducts = () => {
        navigate("/products");
    }

    return (
        <div>
            <FormTable
                inputNames={["Name", "Descrption", "Price", "Stock", "Images"]}
                inputTypes={["text", "text", "text", "text", "file"]}
                inputValues={["", "",  "",  "",  ""]}
                actionName={action as string}
                actionHandler={doAddOrUpdateProduct}
                backUrl="/contacts"/>
        </div>
    )
    
}

export default AddOrUpdateProduct;