import axios from 'axios';
import { useNavigate } from 'react-router';
import FormTable from './FormTable';

function Register() {
    const navigate = useNavigate()

    function doRegister (formData : FormData) {
        const requestBody = {
            "email": formData.get("email"),
            "username": formData.get("username"),
            "password": formData.get("password"),
            "role": formData.get("role")
        }

        axios
            .post(`http://localhost:5175/api/auth/signup`, requestBody, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                if (res.status == 201) {
                    sessionStorage.setItem("user_registered", "true");
                    navigate("/");
                }
            })
            .catch((err) => {return false});
    }

    const email : string = sessionStorage.getItem("email") as string;

    return (
        <FormTable
            inputNames={["email", "username", "password", "role"]}
            inputTypes={[(email == null || email == "null" ? "text" : "fixed-text"), 
                "text", "text", "option"]}
            inputValues={[email, "", "", "Customer,BusinessOwner"]}
            actionName="REGISTER"
            actionHandler={doRegister}/>
    )
}

export default Register;