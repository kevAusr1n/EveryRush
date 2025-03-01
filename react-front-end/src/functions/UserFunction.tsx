import { googleLogout } from "@react-oauth/google";
import { FormEvent } from "react";
import APICall from "../config/ApiConfig";
import { getDefaultAuthScheme } from "../config/AuthConfig";


function setLoginSuccessUserInfoFromResponse(res : any) {
    localStorage.setItem("userid", res.data.id);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("username", res.data.userName);
    localStorage.setItem("role", res.data.role);
    if (getDefaultAuthScheme() == "jwt") {
        localStorage.setItem("jwt", res.data.jwt);
    }
}

async function signInWithCredential(props: { email: string, password: string }) : Promise<string> {
    let result : string = "failure";
    var requestJson = {
        email : props.email,
        password : props.password
    }

    await APICall().post(`/api/user/signin`, requestJson)
    .then((res) => {
        if (res.status == 200 && res.data.email != "none") {
            setLoginSuccessUserInfoFromResponse(res);
            result = "success";
        } else if (res.data.result == "failure") {
            result = "email not confirmed";
        }
    })
    .catch((err) => alert(err));

    return result;
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

async function signIn(props: { formSubmitEvent: FormEvent<HTMLFormElement> }) : Promise<string> {
    props.formSubmitEvent.preventDefault();
    const formData = new FormData(props.formSubmitEvent.currentTarget);
    return await signInWithCredential({email: formData.get("email") as string, password: formData.get("password") as string});
}

async function signUp (props: { 
    email: string,
    username: string,
    password: string,
    role: string,
    provider: string
 }) : Promise<boolean> {
    let isSucceed : boolean = false;
    let signInRequired : boolean = true;
    const requestBody = {
        "email": props.email,
        "username": props.username,
        "password": props.password,
        "role": props.role,
        "provider": props.provider,
        "signin_required": signInRequired
    }

    await APICall().post(`/api/user/signup`, requestBody)
    .then((res) => {
        if (res.status == 200) {
            if (signInRequired) {
                setLoginSuccessUserInfoFromResponse(res);
            }
            isSucceed = true;
        }
    })
    .catch((err) => {console.log(err)});

    return isSucceed;
}


async function signUpFromForm (props: { formSubmitEvent: FormEvent<HTMLFormElement> }) : Promise<boolean> {
    props.formSubmitEvent.preventDefault();

    let isSucceed : boolean = false;
    let signInRequired : boolean = true;
    const formData = new FormData(props.formSubmitEvent.currentTarget);
    const requestBody = {
        "email": formData.get("email"),
        "username": formData.get("username"),
        "password": formData.get("password"),
        "role": formData.get("role"),
        "signin_required": signInRequired
    }

    await APICall().post(`/api/user/signup`, requestBody)
    .then((res) => {
        if (res.status == 200) {
            isSucceed = true;
        }
    })
    .catch((err) => {console.log(err)});

    return isSucceed;
}

async function signUpConfirm(props: { email: string, code: string }) : Promise<boolean> {
    let isSucceed : boolean = false;

    var request = {
        email: props.email,
        code: props.code
    }

    await APICall()
    .post(`/api/user/signup-confirm`, request)
    .then((res) => {
        if (res.data.result == "success") {
            isSucceed = true;
        }
    })
    .catch((err) => {console.log(err)});

    return isSucceed;
}

async function EditUser(props: {
    username?: string, 
    oldPassword?: string,
    newPassword?: string
}) {
    let isSucceed : boolean = false;

    var request = {
        id: localStorage.getItem("userid"),
        username: props.username != undefined ? props.username : "",
        oldPassword: props.oldPassword != undefined ? props.oldPassword : "",
        newPassword: props.newPassword != undefined ? props.newPassword : ""
    }

    await APICall().post(`/api/user/edit`, request)
    .then((res) => {
        if (res.status == 200 && res.data.result == "success") {
            if (props.username != undefined) {
                localStorage.setItem("username", props.username);
            }
            isSucceed = true;
        }
    })
    .catch((err) => {console.log(err)});

    return isSucceed;
}

async function sendPasswordResetEmail(props: { email: string }) : Promise<boolean> {
    let isSucceed : boolean = false;

    await APICall()
    .post(`/api/user/send-password-reset-email?email=${props.email}`)
    .then((res) => {
        if (res.data.result == "success") {
            isSucceed = true;
        }
    })
    .catch((err) => {console.log(err)});

    return isSucceed;
}

async function resetPassword(props: { email: string, code: string, newPassword: string }) : Promise<boolean> {
    let isSucceed : boolean = false;

    var request = {
        email: props.email,
        code: props.code,
        newPassword: props.newPassword
    }
    await APICall().post(`/api/user/password-reset`, request)
    .then((res) => {
        if (res.data.result == "success") {
            isSucceed = true;
        }
    })
    .catch((err) => {console.log(err)});

    return isSucceed;
}

async function isThirdPartyUserRegistered(props: {
    email: string,
    token: string,
    provider: string
}) : Promise<boolean> {
    let isSucceed : boolean = false;
    
    await APICall().get(`/api/user/third-party-signin-check?email=${props.email}&token=${props.token}&provider=${props.provider}`)
    .then((res) => {
        if (res.data.result == "success") {
            setLoginSuccessUserInfoFromResponse(res);
            isSucceed = true;
        }
    })
    .catch((err) => {console.log(err)});

    return isSucceed;
}

export { isUserSignedIn , signOut , signIn, signUp, signUpFromForm, EditUser, isUserCustomerOrGuest };
export { sendPasswordResetEmail, resetPassword, signUpConfirm, isThirdPartyUserRegistered };