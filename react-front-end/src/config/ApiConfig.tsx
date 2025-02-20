import axios from "axios";
import { backServerEndpoint } from "./BackendServerConfig";

function APICall() {
    return axios.create({
        baseURL: backServerEndpoint, // Your backend URL
        withCredentials: true
    });
}

export default APICall;