import { Dispatch, FormEvent, SetStateAction } from "react";
import { isStringEmpty } from "./Utils";
import APICall from "../config/ApiConfig";
import { Product } from "../type/EntityType";

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
        case "Price Ascending":
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

    APICall().get(`/api/products?${query}`, {
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

    if (!isStringEmpty(formData.get("old images") as string)) {
        formData.append("oldImageUrl", formData.get("old images") as string);
    }

    if (props.files != null) {
        for (let i = 0; i < props.files.length; i++) {
            formData.append("files", props.files[i]); 
        }
    }
    
    await APICall().post(`/api/products/${props.action}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    .then((_) => isSucceed = true)
    .catch((err) => console.log(err));

    return isSucceed;
}

async function getProductDetail(props: {id: string}) : Promise<Product> {
    var productResponse : Product = {} as Product;
    await APICall().get(`/api/products/${props.id}`)
    .then((res) => {
        if (res.status == 200) {
            productResponse = res.data;
        }
    })
    .catch((err) => console.log(err));
    return productResponse;
}

async function deleteProducts (props: {id: string}) {
    await APICall().delete(`/api/products/delete/${props.id}`)
}

async function updateProductStatus (props: {id: string, status: number}) {
    await APICall().post(`/api/products/status-update/${props.id}?newstatus=${props.status}`)
}

async function updateProductStock (props: {id: string, stock: number}) {
    await APICall().post(`/api/products/stock-update/${props.id}?newstock=${props.stock}`)
}

export { getPaginatedProducts, addOrUpdateProducts, getProductDetail, deleteProducts, updateProductStatus, updateProductStock };