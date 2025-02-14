import axios from "axios";
import { Dispatch, SetStateAction } from "react";

function GetPaginatedProducts(props: {
  page: number,
  size: number,
  searchKey: string, 
  orderKey: string,
  setResponse: Dispatch<SetStateAction<any>>,
}){
    let orderBy = "";
    let order = "";

    if (props.orderKey === "Popularity") {
        orderBy = "";
        order = "";
    }
    else if (props.orderKey === "Price Asceding") {
        orderBy = "price";
        order = "asc";
    }
    else if (props.orderKey === "Price Descending") {
        orderBy = "price";
        order = "desc";
    }
    else if (props.orderKey === "Oldest Product") {
        orderBy = "time";
        order = "asc";
    }
    else if (props.orderKey === "Newest Product") {
        orderBy = "time";
        order = "desc";
    }
    
    let query : string = `page=${props.page}&size=${props.size}`;

    if (props.searchKey != undefined && props.searchKey != null && props.searchKey != '') {
        query += `&keyword=${props.searchKey}`;
    }
    if (orderBy != undefined && orderBy != null && orderBy != '') {
        query += `&orderby=${orderBy}`;
    }
    if (order != undefined && order != null && order != '') {
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

export { GetPaginatedProducts };