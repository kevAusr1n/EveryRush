import { useNavigate, useParams, useSearchParams } from "react-router";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { useState } from "react";
import { Input } from "../type/ObjectType";
import InputField from "../components/InputField";
import { addOrUpdateContacts } from "../functions/ContactFunction";
import { isStringEmpty } from "../functions/Utils";
import { MonoStyleText } from "../components/Text";
import { BlackButton } from "../components/Button";

function AddOrUpdateContactPage() {
    const navigate = useNavigate();
    const { action } = useParams();
    const [searchParams, _] = useSearchParams();
    const [firstName, setFirstName] = useState(action === "add" ? "" : searchParams.get("firstname") as string);
    const [lastName, setLastName] = useState(action === "add" ? "" : searchParams.get("lastname") as string);
    const [email, setEmail] = useState(action === "add" ? "" : searchParams.get("email") as string);
    const [phone, setPhone] = useState(action === "add" ? "" : searchParams.get("phone") as string);
    const [address, setAddress] = useState(action === "add" ? "" : searchParams.get("address") as string);
    const [city, setCity] = useState(action === "add" ? "" : searchParams.get("city") as string);
    const [state, setState] = useState(action === "add" ? "" : searchParams.get("state") as string);
    const [postcode, setPostcode] = useState(action === "add" ? "" : searchParams.get("postcode") as string);

    const [addOrUpdateContactResultMsg, setAddOrUpdateContactResultMsg] = useState("");

    const addOrUpdateContactInputs: Input[] = [
        { name: "first name", type: "text", value: firstName, style: "w-full md:w-100 lg:w-200", valueChangeHandler: (e) => setFirstName(e.target.value) },
        { name: "last name", type: "text", value: lastName, style: "w-full md:w-100 lg:w-200", valueChangeHandler: (e) => setLastName(e.target.value) },
        { name: "email", type: "text", value: email, style: "w-full md:w-100 lg:w-200", valueChangeHandler: (e) => setEmail(e.target.value) },
        { name: "phone", type: "text", value: phone, style: "w-full md:w-100 lg:w-200", valueChangeHandler: (e) => setPhone(e.target.value) },
        { name: "address", type: "text", value: address, style: "w-full md:w-100 lg:w-200", valueChangeHandler: (e) => setAddress(e.target.value) },
        { name: "city", type: "text", value: city, style: "w-full md:w-100 lg:w-200", valueChangeHandler: (e) => setCity(e.target.value) },
        { name: "state", type: "text", value: state, style: "w-full md:w-100 lg:w-200", valueChangeHandler: (e) => setState(e.target.value) },
        { name: "postcde", type: "text", value: postcode, style: "w-full md:w-100 lg:w-200", valueChangeHandler: (e) => setPostcode(e.target.value) },
    ];

    const addOrUpdateContactHandler = async () => {
        if (isStringEmpty(firstName)
            || isStringEmpty(lastName)
            || isStringEmpty(email)
            || isStringEmpty(phone)
            || isStringEmpty(address)
            || isStringEmpty(city)
            || isStringEmpty(state)
            || isStringEmpty(postcode)
        ) {
            setAddOrUpdateContactResultMsg("Please fill in all fields");
            return;
        }
        if (await addOrUpdateContacts({
            action: action as string, 
            id: searchParams.get("id") as string,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            address: address,
            city: city,
            state: state,
            postcode: postcode
        })) {
            navigate("/contacts");
        }
    };

    return (
        <ResponsiveDiv style="flex flex-col items-center" children={<>
            <ResponsiveDiv style="mt-20 mb-20 gap-5 p-20 flex flex-col items-center" children={<>
                {
                    addOrUpdateContactInputs.map((addOrUpdateContactInput, index) => {
                        return <ResponsiveDiv key={index} style="flex flex-col items-start gap-5" children={<>
                            <InputField name={addOrUpdateContactInput.name} 
                                type={addOrUpdateContactInput.type} 
                                value={addOrUpdateContactInput.value} 
                                style={addOrUpdateContactInput.style} 
                                options={addOrUpdateContactInput.options}
                                valueChangeHandler={addOrUpdateContactInput.valueChangeHandler} 
                            />
                        </>} />
                    })
                }
                <BlackButton buttonName={action?.toLocaleUpperCase() as string} size="w-60 h-10" clickHandler={() => addOrUpdateContactHandler()} />
                <MonoStyleText style='text-red-500' content={addOrUpdateContactResultMsg} />
            </>} />
        </>} />
    )
    
}

export default AddOrUpdateContactPage;