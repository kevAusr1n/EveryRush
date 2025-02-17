import { Link, Outlet } from "react-router";
import LoginSection from "../components/LoginSection";

function IndexPage() {
    return (
        <>
            <div className="items-center flex flex-col gap-4">
                <header className="flex gap-4 p-4 text-black">
                    <Link to="products"><p className="text-black">Products</p></Link>
                    <Link to="cart"><p className="text-black">Cart</p></Link>
                    <Link to="orders"><p className="text-black">Orders</p></Link>
                    <Link to="contacts"><p className="text-black">Contacts</p></Link>
                    <Link to="messages"><p className="text-black">Messages</p></Link>
                    <LoginSection />
                </header>
            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default IndexPage;