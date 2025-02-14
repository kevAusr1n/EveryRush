import { Link, Outlet, useNavigate } from "react-router";
import { ReactNode } from "react";
import { googleLogout } from "@react-oauth/google";
import { isUserLoggedIn, SignOut } from "../functions/UserFunction";

function IndexPage() {
    const navigate = useNavigate();

    const loginSection = () : ReactNode => {
        if (!isUserLoggedIn()) {
            return (
                <>
                    <Link to="/signin"><p className="text-black">SIGN IN</p></Link>
                    <Link to="/signup"><p className="text-black">REGISTER</p></Link>
                </>
            );
        } else {
            return (
                <>
                    <p>{localStorage.getItem("username") as string}</p>
                    <button onClick={() => {SignOut();navigate("/index")}}>SIGN OUT</button>
                </>
            );
        }
    }

    return (
        <div>
            <header className="flex gap-4 p-4 text-black shadow">
                <Link to="products"><p className="text-black">Products</p></Link>
                <Link to="cart"><p className="text-black">Cart</p></Link>
                <Link to="orders"><p className="text-black">Orders</p></Link>
                <Link to="contacts"><p className="text-black">Contacts</p></Link>
                <Link to="messages"><p className="text-black">Messages</p></Link>
                {loginSection()}
            </header>
            <main>
                <Outlet /> {/* This will render the matched child route */}
            </main>
        </div>
    )
}

export default IndexPage;