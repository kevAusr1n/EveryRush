import { Link, Outlet } from "react-router";
import { ReactNode } from "react";

function BrowsePage() {
    const userInfoSection = () : ReactNode => {
        if (sessionStorage.getItem('username') == null) {
            return (
                <>
                    <Link to="signin"><p className="text-black">SIGN IN</p></Link>
                    <Link to="signup"><p className="text-black">REGISTER</p></Link>
                </>
            );
        } else {
            return (
                <>
                    <p>{sessionStorage.getItem('username') as string}</p>
                    <Link to="signout"><p className="text-black">SIGN OUT</p></Link>
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