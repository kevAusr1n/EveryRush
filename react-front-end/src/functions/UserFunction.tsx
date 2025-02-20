import { googleLogout } from "@react-oauth/google";
import { FormEvent } from "react";
import APICall from "../config/ApiConfig";

function setLoginSuccessUserInfo(res : any) {
    localStorage.setItem("userid", res.data.id);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("username", res.data.userName);
    localStorage.setItem("role", res.data.role);
}

async function SignInWithCredential(props: { email: string, password: string }) : Promise<boolean> {
    let isSucceed : boolean = false;
    var requestJson = {
        email : props.email,
        password : props.password
    }

    await APICall().post(`/api/auth/signin`, requestJson)
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

function SignOut() {
    if (localStorage.getItem("provider") == "google") {
        googleLogout();
    }

    localStorage.removeItem("userid");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("provider");
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

    await APICall().post(`/api/auth/signup`, requestBody, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((res) => {
        if (signInRequired && res.status == 200) {
            setLoginSuccessUserInfo(res);
        }
        isSucceed = true;
    })
    .catch((err) => {console.log(err)});

    return isSucceed;
}

export { isUserSignedIn , SignOut, SignIn, SignUp };