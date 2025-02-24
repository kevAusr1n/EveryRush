import { googleLogout } from "@react-oauth/google";
import { FormEvent } from "react";
import APICall from "../config/ApiConfig";
import { getDefaultAuthScheme } from "../config/AuthConfig";

function setLoginSuccessUserInfo(res : any) {
    localStorage.setItem("userid", res.data.id);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("username", res.data.userName);
    localStorage.setItem("role", res.data.role);
    if (getDefaultAuthScheme() == "jwt") {
        localStorage.setItem("jwt", res.data.jwt);
    }
}

async function SignInWithCredential(props: { email: string, password: string }) : Promise<boolean> {
    let isSucceed : boolean = false;
    var requestJson = {
        email : props.email,
        password : props.password
    }

    await APICall().post(`/api/user/signin`, requestJson)
    .then((res) => {
        if (res.status == 200 && res.data.email != "none") {
            setLoginSuccessUserInfo(res);
            isSucceed = true;
        }
    })
    .catch((err) => alert(err));

    return isSucceed;
}

function isUserSignedIn() : boolean {
    return localStorage.getItem("userid") != null;
}

function isUserCustomerOrGuest() : boolean {
    return localStorage.getItem("role") == "Customer" || localStorage.getItem("role") == undefined;
}

function SignOut() {
    if (localStorage.getItem("provider") == "google") {
        googleLogout();
    }

    localStorage.removeItem("userid");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("provider");
    localStorage.removeItem("jwt");
}

async function SignIn(props: { formSubmitEvent: FormEvent<HTMLFormElement> }) : Promise<boolean> {
    props.formSubmitEvent.preventDefault();
    const formData = new FormData(props.formSubmitEvent.currentTarget);
    return await SignInWithCredential({email: formData.get("email") as string, password: formData.get("password") as string});
}

async function SignUp (props: { formSubmitEvent: FormEvent<HTMLFormElement> }) : Promise<boolean> {
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
        if (signInRequired && res.status == 200) {
            setLoginSuccessUserInfo(res);
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
        if (res.status == 200 || res.status == 201) {
            localStorage.setItem("username", props.username != undefined ? props.username : localStorage.getItem("username") as string);
            isSucceed = true;
        }
    })
    .catch((err) => {console.log(err)});

    return isSucceed;
}

export { isUserSignedIn , SignOut, SignIn, SignUp, EditUser, isUserCustomerOrGuest as isUserCustomer };