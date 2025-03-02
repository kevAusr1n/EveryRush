import { useNavigate, useParams, useSearchParams } from "react-router";
import { FormEvent, useEffect, useState } from "react";
import SubmitForm from "../components/SubmitForm";
import { addOrUpdateProducts, getProductDetail } from "../functions/ProductFunction";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { Product } from "../type/EntityType";

function AddOrUpdateProductPage() {
    const navigate = useNavigate();
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();
    const [files, setFiles] = useState<FileList | null>(null);
    
    var inputNames=["Name", "Price", "Stock", "New Images", "Description"];
    var inputTypes=["text", "text", "text", "file", "textarea"];
    var inputValues=["", "",  "", [files, setFiles], ""];
    var inputStyles=["w-200", "w-200",  "w-200",  "w-200", "w-200 h-50"];

    if (action === "update") {
        inputNames=["Name", "Price", "Stock", "Old Images","New Images", "Description"];
        inputTypes=["text", "text", "text", "imageUrl", "image", "textarea"];
        inputValues=[
            searchParams.get("name") as string, 
            searchParams.get("price") as string, 
            searchParams.get("stock") as string, 
            searchParams.get("imageUrl") as string, 
            [files, setFiles], 
            searchParams.get("description") as string
        ];
        inputStyles=["w-200", "w-200",  "w-200",  "w-200", "w-200", "w-200 h-50"];
    }

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={<>
            <ResponsiveDiv style="mt-20 mb-20 gap-5 p-20 flex flex-col items-center" children={<>
                <SubmitForm
                    inputNames={inputNames}
                    inputTypes={inputTypes}
                    inputValues={inputValues}
                    inputStyles={inputStyles}
                    actionName={action as string}
                    actionHandler={async (event: FormEvent<HTMLFormElement>) => {
                        if (await addOrUpdateProducts({
                            action: action as string, 
                            id: searchParams.get("id") as string,
                            files: files,
                            formSubmitEvent: event
                        })) {
                            navigate("/products");
                        }
                    }}
                />
            </>} />
        </>} /> 
    )
}

export default AddOrUpdateProductPage;