import { useNavigate, useParams, useSearchParams } from "react-router";
import { FormEvent, useState } from "react";
import { addOrUpdateProducts } from "../functions/ProductFunction";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { MonoStyleText } from "../components/Text";
import { Input } from "../type/ObjectType";
import { isNonNegativeInteger, isNonNegativeNumber, isStringEmpty } from "../functions/Utils";
import InputField from "../components/InputField";
import { BlackButton } from "../components/Button";

function AddOrUpdateProductPage() {
    const navigate = useNavigate();
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();

    const [name, setName] = useState(action === "add" ? "" : searchParams.get("name") as string);
    const [price, setPrice] = useState(action === "add" ? "" : searchParams.get("price") as string);
    const [stock, setStock] = useState(action === "add" ? "" : searchParams.get("stock") as string);
    const [description, setDescription] = useState(action === "add" ? "" : searchParams.get("description") as string);
    const [toKeepImageUrl, setToKeepImageUrl] = useState(action === "add" ? "" : searchParams.get("imageUrl") as string);
    const [files, setFiles] = useState<FileList | null>(null);
    const [priceCheckMsg, setPriceCheckMsg] = useState(""); 
    const [stockCheckMsg, setStockCheckMsg] = useState("");
    const [imageCheckMsg, setImageCheckMsg] = useState(""); 
    const [addOrUpdateProductResult, setAddOrUpdateProductResult] = useState("");
    
    var addOrProductInputs: Input[] = [
        { name: "name", type: "text", value: name, style: "w-full md:w-100 lg:w-200", valueChangeHandler: (e) => setName(e.target.value) },
        { name: "price", type: "text", value: price, style: "w-full md:w-100 lg:w-200", 
            valueChangeHandler: (e) => {
                setPrice(e.target.value);
                if (!isNonNegativeNumber(e.target.value)) {
                    setPriceCheckMsg("Please enter a number greater than 0");
                } else {
                    setPriceCheckMsg("");
                }
            } 
        },
        { name: "stock", type: "text", value: stock, style: "w-full md:w-100 lg:w-200",
            valueChangeHandler: (e) => {
                setStock(e.target.value);
                if (!isNonNegativeInteger(e.target.value)) {
                    setStockCheckMsg("Please enter a integer not lesser than 0");
                } else {
                    setStockCheckMsg("");
                }
            } 
        },
        { name: "New Images", type: "image", value: [files, setFiles], style: "w-full md:w-100 lg:w-200" }, 
        { name: "description", type: "textarea", value: description, style:"w-full md:w-100 lg:w-200 h-50", valueChangeHandler: (e) => setDescription(e.target.value) },
    ];

    var checkMsgs: string[] = ["", priceCheckMsg, stockCheckMsg, "", ""];

    if (action === "update") {
        addOrProductInputs.splice(
            3, 
            0,
            { name: "Old Images", type: "imageUrl", value: searchParams.get("imageUrl") as string, style: "w-full md:w-100 lg:w-200", 
                valueChangeHandler: (value) => {
                    setToKeepImageUrl(value);
                    if (isStringEmpty(value) && (files == null || files.length == 0)) {
                        setImageCheckMsg("Please keep at least one image for this product from old/new ones");
                    } else {
                        setImageCheckMsg("");
                    }
                }
            } 
        );
        checkMsgs.splice(3, 0, imageCheckMsg);
    }

    const addOrUpdateProductHandler = async () => {
        if (isStringEmpty(name) 
            || isStringEmpty(price) 
            || isStringEmpty(stock) 
            || (isStringEmpty(toKeepImageUrl) && (files == null || files.length == 0))
            || isStringEmpty(description)) {
            return;
        }

        if (!checkMsgs.every(msg => isStringEmpty(msg))) {
            return;
        }

        var apiResponse = await addOrUpdateProducts({
            action: action as string, 
            id: searchParams.get("id") as string,
            files: files,
            name: name,
            price: price,
            stock: stock,
            description: description,
            toKeepImageUrl: toKeepImageUrl
        });
        if (apiResponse.result == "success") {
            navigate("/products");
        } else {
            setAddOrUpdateProductResult(apiResponse.failureDescription);
        }
    }

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={<>
            <ResponsiveDiv style="mt-20 gap-5 mb-5 flex flex-col items-center" children={<>
                {
                    addOrProductInputs.map((addOrUpdateProductInput, index) => {
                        return <ResponsiveDiv key={index} style="flex flex-col items-start gap-5" children={<>
                            <InputField name={addOrUpdateProductInput.name} 
                                type={addOrUpdateProductInput.type} 
                                value={addOrUpdateProductInput.value} 
                                style={addOrUpdateProductInput.style} 
                                options={addOrUpdateProductInput.options}
                                valueChangeHandler={addOrUpdateProductInput.valueChangeHandler} 
                            />
                            <MonoStyleText style="text-red-500" content={checkMsgs[index]} />
                        </>} />
                    })
                }
                <BlackButton buttonName={action?.toLocaleUpperCase() as string} size="w-60 h-10" clickHandler={() => addOrUpdateProductHandler()} />
                <MonoStyleText style="text-red-500" content={addOrUpdateProductResult} />
            </>} />
        </>} /> 
    )
}

export default AddOrUpdateProductPage;