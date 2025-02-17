import axios from "axios";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { isStringEmpty } from "./Utils";

function getPaginatedProducts(props: {
  page: number,
  size: number,
  searchTerm: string, 
  orderTerm: string,
  setResponse: Dispatch<SetStateAction<any>>
}){    
    let orderBy = "";
    let order = "";

    switch(props.orderTerm){
        case "Popularity":
            orderBy = "";
            order = "";
            break;
        case "Price Asceding":
            orderBy = "price";
            order = "asc";
            break;
        case "Price Descending":
            orderBy = "price";
            order = "desc";
            break;
        case "Oldest Product":
            orderBy = "time";
            order = "asc";
            break;
        case "Newest Product":
            orderBy = "time";
            order = "desc";
            break;
    }
       
    let query : string = `page=${props.page}&size=${props.size}`;

    if (!isStringEmpty(props.searchTerm)) {
        query += `&keyword=${props.searchTerm}`;
    }
    if (!isStringEmpty(orderBy)) {
        query += `&orderby=${orderBy}`;
    }
    if (!isStringEmpty(order)) {
        query += `&order=${order}`;
    }

    axios.get(`http://localhost:5175/api/products?${query}`, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((res) => {
        props.setResponse(res.data);
    })
    .catch((err) => console.log(err));
}

async function addOrUpdateProducts(props: {
    action: string,
    id: string,
    files: FileList | null,
    formSubmitEvent: FormEvent<HTMLFormElement>
}) : Promise<boolean> {
    props.formSubmitEvent.preventDefault();
    let formData = new FormData(props.formSubmitEvent.currentTarget);
    let isSucceed : boolean = false;

    formData.append("userId", localStorage.getItem("userid") as string);
    formData.append("id", props.id);

    if (props.files != null) {
        for (let i = 0; i < props.files.length; i++) {
            formData.append("files", props.files[i]); 
        }
    }
    
    await axios.post(`http://localhost:5175/api/products/${props.action}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    .then((_) => isSucceed = true)
    .catch((err) => console.log(err));

    return isSucceed;
}


export { getPaginatedProducts as GetPaginatedProducts,  addOrUpdateProducts };