import { Dispatch, SetStateAction } from "react";
import { isStringEmpty } from "./Utils";
import APICall from "../config/ApiConfig";
import { Product } from "../type/ObjectType";
import { apiExceptionFailureDescription, ApiResponse } from "../type/ResponseType";

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
    name: string,
    files: FileList | null,
    description: string,
    price: string,
    stock: string,
    toKeepImageUrl: string
}) : Promise<ApiResponse> {
    var formData = new FormData();
    var apiResponse: ApiResponse = {result: "failure", failureDescription: ""} as ApiResponse;
    formData.append("userId", localStorage.getItem("userid") as string);
    formData.append("id", props.id)
    formData.append("name", props.name);
    formData.append("description", props.description);
    formData.append("price", props.price);
    formData.append("stock", props.stock);
    formData.append("toKeepImageUrl", props.toKeepImageUrl);
   
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
    .then((res) => {
        if (res.data.result == "success") {
            apiResponse.result = res.data.result;
        } else {
            apiResponse.failureDescription = res.data.failureDescription;
        }
    })
    .catch((err) => {
        apiResponse.failureDescription = apiExceptionFailureDescription;
    });

    return apiResponse;
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

export { getPaginatedProducts, addOrUpdateProducts, getProductDetail, deleteProducts, updateProductStatus };