import axios from "axios";
import { backServerEndpoint } from "./BackendServerConfig";
import { getDefaultAuthScheme } from "./AuthConfig";

function APICall() {
    if (getDefaultAuthScheme() == "jwt") {
        return axios.create({
            baseURL: backServerEndpoint,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt") as string}`
            }
        })
    } else if (getDefaultAuthScheme() == "cookie") {
        return axios.create({
            baseURL: backServerEndpoint,
            withCredentials: true
        })
    } else {
        return axios.create({
            baseURL: backServerEndpoint
        })
    }

}

export default APICall;