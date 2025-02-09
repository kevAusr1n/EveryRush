import { Link, Outlet, useNavigate } from "react-router";
import { ReactNode } from "react";
import { googleLogout } from "@react-oauth/google";
import { isUserLoggedIn } from "../functions/UserUtils";

function BrowsePage() {
    const navigate = useNavigate();

    const doLogOut = () => {
        if (localStorage.getItem("provider") == "google") {
            googleLogout();
        }

        localStorage.removeItem("user");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("provider");
        navigate("/");
    };

    const userInfoSection = () : ReactNode => {
        if (!isUserLoggedIn()) {
            return (
                <>
                    <Link to="signin"><p className="text-black">SIGN IN</p></Link>
                    <Link to="signup"><p className="text-black">REGISTER</p></Link>
                </>
            );
        } else {
            return (
                <>
                    <p>{localStorage.getItem("username") as string}</p>
                    <button onClick={() => doLogOut()}>SIGN OUT</button>
                </>
            );
        }
    }

    return (
        <div>
            <header className="flex gap-4 p-4 bg-gradient-to-b from-white to-gray-200 shadow">
                <Link to="products"><p className="text-black">Products</p></Link>
                <Link to="cart"><p className="text-black">Cart</p></Link>
                <Link to="orders"><p className="text-black">Orders</p></Link>
                <Link to="contacts"><p className="text-black">Contacts</p></Link>
                <Link to="messages"><p className="text-black">Messages</p></Link>
                {userInfoSection()}
            </header>
            <main>
                <Outlet /> {/* This will render the matched child route */}
            </main>
        </div>
    )
}

export default BrowsePage;