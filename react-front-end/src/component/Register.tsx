import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import GenerateInputRowFormat from '../functions/InputRowGenerator';

function Register() {
    const navigate = useNavigate()

    function doRegister (formData : FormData) {
        const body = {
            "email": formData.get("email"),
            "username": formData.get("username"),
            "password": formData.get("password"),
            "role": formData.get("role")
        }

        axios
            .post(`http://localhost:5175/api/auth/signup`, {
                headers: {
                    Accept: 'application/json'
                },
                body: JSON.stringify(body)
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
    const inputNames = ["email", "username", "password", "role"];
    const inputTypes= ["text", "text", "text", "option"];
    const inputValues= [email, "", "", "Customer,BusinessOwner"];

    return (
        <div className="flex items-center justify-center">
            <form action={doRegister} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {
                    inputNames.map((inputName, index) => {
                        return GenerateInputRowFormat(inputName, inputTypes[index], inputValues[index]);
                    })
                }
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                focus:outline-none focus:shadow-outline" type="submit">
                    REGISTER
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                focus:outline-none focus:shadow-outline" onClick={() => navigate("/")}>
                    Back
                </button>
            </form>
        </div>
    )
}

export default Register;