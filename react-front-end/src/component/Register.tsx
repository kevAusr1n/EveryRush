import axios from 'axios';
import FormTable from './FormTable';

function Register() {
    const doRegister = async (formData : FormData) => {
        const body = {
            "email": formData.get("email"),
            "username": formData.get("username"),
            "password": formData.get("password"),
            "role": formData.get("role")
        }

        axios
            .post(`http://localhost:5175/api/auth/register`, {
                headers: {
                    Accept: 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then((res) => {
                if (res.status == 201) {
                    sessionStorage.setItem("email", res.data.email);
                    sessionStorage.setItem("username", res.data.username);
                    sessionStorage.setItem("password", res.data.password);
                    sessionStorage.setItem("role", res.data.role);
                    sessionStorage.setItem("user_registered", "true");
                    window.location.href = "/";
                }
            })
            .catch((err) => {return false});
    }

    const email : string = sessionStorage.getItem("email") != null ? sessionStorage.getItem("email") : "";
    
    return (
        <div>
            <FormTable inputNames={["Email", "Username", "Password", "Role"]}
                inputTypes={["text", "text", "text", "option"]}
                inputValues={[email, "", "", "Customer,BusinessOwner"]}
                actionName="REGISTER" 
                actionHandler={doRegister}/>
        </div>
    )
}

export default Register;