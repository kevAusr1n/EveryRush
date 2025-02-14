import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { FormEvent } from "react";

function SignInWithCredential(props: { email: string, password: string }) : boolean {
    var requestJson = {
        email : props.email,
        password : props.password
    }

    axios.post(`http://localhost:5175/api/auth/signin`, requestJson, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        }
    })
    .then((res) => {
        if (res.data.email != "none") {
            localStorage.setItem("userid", res.data.id);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("username", res.data.userName);
            localStorage.setItem("role", res.data.role);
            return true
        }
    })
    .catch((err) => alert(err));

    return false;
}

function isUserLoggedIn() : boolean {
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

function SignIn(props: { formSubmitEvent: FormEvent<HTMLFormElement> }) : boolean {
    props.formSubmitEvent.preventDefault();
    const formData = new FormData(props.formSubmitEvent.currentTarget);
    return SignInWithCredential({email: formData.get("email") as string, password: formData.get("password") as string});
}

function SignUp (props: { formSubmitEvent: FormEvent<HTMLFormElement> }) : boolean {
    props.formSubmitEvent.preventDefault();
    const formData = new FormData(props.formSubmitEvent.currentTarget);
    const requestBody = {
        "email": formData.get("email"),
        "username": formData.get("username"),
        "password": formData.get("password"),
        "role": formData.get("role")
    }

    axios.post(`http://localhost:5175/api/auth/signup`, requestBody, {
        headers: {
            Accept: 'application/json'
        }
    })
    .then((res) => {
        return SignInWithCredential({email: formData.get("email") as string, password: formData.get("password") as string});
    })
    .catch((err) => {console.log(err)});

    return false;
}

export { isUserLoggedIn, SignOut, SignIn, SignUp };