import { googleLogout } from "@react-oauth/google";
import { FormEvent } from "react";
import APICall from "../config/ApiConfig";
import { getDefaultAuthScheme } from "../config/AuthConfig";
import { apiExceptionFailureDescription, ApiResponse } from "../type/ResponseType";


function setLoginSuccessUserInfoFromResponse(res : any) {
    localStorage.setItem("userid", res.data.id);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("username", res.data.userName);
    localStorage.setItem("role", res.data.role);
    if (getDefaultAuthScheme() == "jwt") {
        localStorage.setItem("jwt", res.data.jwt);
    }
}

function isUserSignedIn() : boolean {
    return localStorage.getItem("userid") != null;
}

function isUserCustomerOrGuest() : boolean {
    return localStorage.getItem("role") == "Customer" || localStorage.getItem("role") == undefined;
}

function signOut() {
    if (localStorage.getItem("provider") == "google") {
        googleLogout();
    } else {
        APICall().post(`/api/user/signout`);
    }
    localStorage.removeItem("userid");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("provider");
    localStorage.removeItem("jwt");
}

async function signIn(props: {email: string, password: string}) : Promise<ApiResponse> {
    let apiResponse : ApiResponse = { result: "failure", failureDescription: ""} as ApiResponse;
    var requestJson = {
        email : props.email,
        password : props.password
    }

    await APICall().post(`/api/user/signin`, requestJson)
    .then((res) => {
        if (res.data.result == "success") {
            setLoginSuccessUserInfoFromResponse(res);
            apiResponse.result = "success";
        } else {
            apiResponse.failureDescription = res.data.failureDescription;
        }
    })
    .catch((_) => {
        apiResponse.failureDescription = apiExceptionFailureDescription;
    });

    return apiResponse;
}

async function signUp (props: { 
    email: string,
    username: string,
    password: string,
    role: string,
    provider: string
 }) : Promise<ApiResponse> {
    let apiResponse : ApiResponse = { result: "failure", failureDescription: ""} as ApiResponse;

    const requestBody = {
        "email": props.email,
        "username": props.username,
        "password": props.password,
        "role": props.role,
        "provider": props.provider,
    }

    await APICall().post(`/api/user/signup`, requestBody)
    .then((res) => {
        if (res.data.result == "success") {
            apiResponse.result = "success";
            if ("google" === props.provider) {
                setLoginSuccessUserInfoFromResponse(res);
            }
        } else {
            apiResponse.failureDescription = res.data.failureDescription;
        }
    })
    .catch((_) => {
        apiResponse.failureDescription = apiExceptionFailureDescription;
    });

    return apiResponse;
}

async function signUpConfirm(props: { email: string, code: string }) : Promise<ApiResponse> {
    let apiResponse : ApiResponse = { result: "failure", failureDescription: ""} as ApiResponse;

    var request = {
        email: props.email,
        code: props.code
    }

    await APICall()
    .post(`/api/user/signup-confirm`, request)
    .then((res) => {
        if (res.data.result == "success") {
            apiResponse.result = "success";
        } else {
            apiResponse.failureDescription = res.data.failureDescription;
        }
    })
    .catch((_) => {
        apiResponse.failureDescription = apiExceptionFailureDescription;
    });
    return apiResponse;
}

async function EditUser(props: {
    username?: string, 
    oldPassword?: string,
    newPassword?: string
}) : Promise<ApiResponse> {
    let apiResponse : ApiResponse = { result: "failure", failureDescription: ""} as ApiResponse;

    var request = {
        id: localStorage.getItem("userid"),
        username: props.username != undefined ? props.username : "",
        oldPassword: props.oldPassword != undefined ? props.oldPassword : "",
        newPassword: props.newPassword != undefined ? props.newPassword : ""
    }

    await APICall().post(`/api/user/edit`, request)
    .then((res) => {
        if (res.data.result == "success") {
            apiResponse.result = "success";
            if (props.username != undefined) {
                localStorage.setItem("username", props.username);
            }
        } else {
            apiResponse.failureDescription = res.data.failureDescription;
        }
    })
    .catch((_) => {
        apiResponse.failureDescription = apiExceptionFailureDescription;
    });

    return apiResponse;
}

async function sendPasswordResetEmail(props: { email: string }) : Promise<ApiResponse> {
    let apiResponse : ApiResponse = { result: "failure", failureDescription: ""} as ApiResponse;

    await APICall()
    .post(`/api/user/send-password-reset-email?email=${props.email}`)
    .then((res) => {
        if (res.data.result == "success") {
            apiResponse.result = "success";
        } else {
            apiResponse.failureDescription = res.data.failureDescription;
        }
    })
    .catch((_) => {
        apiResponse.failureDescription = apiExceptionFailureDescription;
    });

    return apiResponse;
}

async function resetPassword(props: { email: string, code: string, newPassword: string }) : Promise<ApiResponse> {
    let apiResponse : ApiResponse = { result: "failure", failureDescription: ""} as ApiResponse;

    var request = {
        email: props.email,
        code: props.code,
        newPassword: props.newPassword
    }
    await APICall().post(`/api/user/password-reset`, request)
    .then((res) => {
        if (res.data.result == "success") {
            apiResponse.result = "success";
        } else {
            apiResponse.failureDescription = res.data.failureDescription;
        }
    })
    .catch((_) => {
        apiResponse.failureDescription = apiExceptionFailureDescription;
    });

    return apiResponse;
}

async function isThirdPartyUserRegistered(props: {
    email: string,
    token: string,
    provider: string
}) : Promise<ApiResponse> {
    let apiResponse : ApiResponse = { result: "failure", failureDescription: ""} as ApiResponse;

    await APICall().get(`/api/user/third-party-signin-check?email=${props.email}&token=${props.token}&provider=${props.provider}`)
    .then((res) => {
        if (res.data.result == "success") {
            setLoginSuccessUserInfoFromResponse(res);
            apiResponse.result = "success";
        } else {
            apiResponse.failureDescription = res.data.failureDescription;
        }
    })
    .catch((_) => {
        apiResponse.failureDescription = apiExceptionFailureDescription;
    });

    return apiResponse;;
}

export { isUserSignedIn , signOut , signIn, signUp, EditUser, isUserCustomerOrGuest };
export { sendPasswordResetEmail, resetPassword, signUpConfirm, isThirdPartyUserRegistered };