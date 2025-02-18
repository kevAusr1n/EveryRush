import { useNavigate, useParams, useSearchParams } from "react-router";
import { FormEvent, useState } from "react";
import SubmitForm from "../components/SubmitForm";
import { addOrUpdateProducts } from "../functions/ProductFunction";

function AddOrUpdateProductPage() {
    const navigate = useNavigate();
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();
    const [files, setFiles] = useState<FileList | null>(null);
  
    return (
        <div>
            <SubmitForm
                inputNames={["Name", "Description", "Price", "Stock", "Images"]}
                inputTypes={["text", "text", "text", "text", "file"]}
                inputValues={["", "",  "",  "",  [files, setFiles]]}
                actionName={action as string}
                actionHandler={async (event: FormEvent<HTMLFormElement>) => {
                    if (await addOrUpdateProducts({
                        action: action as string, 
                        id: searchParams.get("id") as string,
                        files: files,
                        formSubmitEvent: event
                    })) {
                        navigate("/index/products");
                    }
                }}
                style="w-200"
                backUrl="/index/products"/>
        </div>
    )
}

export default AddOrUpdateProductPage;