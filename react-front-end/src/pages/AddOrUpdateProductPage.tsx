import { useNavigate, useParams, useSearchParams } from "react-router";
import { FormEvent, useState } from "react";
import SubmitForm from "../components/SubmitForm";
import { addOrUpdateProducts } from "../functions/ProductFunction";
import ResponsiveDiv from "../components/div/ResponsiveDiv";

function AddOrUpdateProductPage() {
    const navigate = useNavigate();
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();
    const [files, setFiles] = useState<FileList | null>(null);
  
    return (
        <ResponsiveDiv style="flex flex-col items-center" children={[
            <ResponsiveDiv style="mt-20 mb-20 gap-5 p-20 flex flex-col items-center bg-white shadow" children={[
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
                />
            ]} />
        ]} /> 
    )
}

export default AddOrUpdateProductPage;