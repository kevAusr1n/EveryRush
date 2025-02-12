import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router";
import FormTable from "./FormTable";
import { useState } from "react";

function AddOrUpdateProduct() {
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();
    const [files, setFiles] = useState<FileList | null>(null);

    const navigate = useNavigate();

    const doAddOrUpdateProduct = (formData : FormData) => {
        formData.append("userId", localStorage.getItem("userid") as string);
        formData.append("id", searchParams.get("id") as string);

        if (files != null) {
            for (let i = 0; i < files.length; i++) {

                formData.append("files", files[i]); 
            }
        }
        
        axios
            .post(`http://localhost:5175/api/products/${action}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((_) => {
                navigate("/products");
            })
            .catch((error) => {alert(error);})
    }

    const doBackToProducts = () => {
        navigate("/products");
    }

    return (
        <div>
            <FormTable
                inputNames={["Name", "Description", "Price", "Stock", "Images"]}
                inputTypes={["text", "text", "text", "text", "file"]}
                inputValues={["", "",  "",  "",  [files, setFiles]]}
                actionName={action as string}
                actionHandler={doAddOrUpdateProduct}
                backUrl="/contacts"/>
        </div>
    )
}

export default AddOrUpdateProduct;