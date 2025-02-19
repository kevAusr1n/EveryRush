import { Link, Outlet } from "react-router";
import LoginSection from "../components/LoginSection";
import ResponsiveDiv from "../components/div/ResponsiveDiv";

function IndexPage() {
    return (
        <>
            <div className="flex flex-col items-center">
                <header className="flex gap-4 p-4 text-black">
                    <Link to="products"><p className="text-black">Products</p></Link>
                    <Link to="cart"><p className="text-black">Cart</p></Link>
                    <Link to="orders"><p className="text-black">Orders</p></Link>
                    <Link to="contacts"><p className="text-black">Contacts</p></Link>
                    <Link to="messages"><p className="text-black">Messages</p></Link>
                    <LoginSection />
                </header>
            </div>
            <ResponsiveDiv style="bg-gray-200 w-full h-full" children={[(<main><Outlet /></main>)]} />
        </>
    )
}

export default IndexPage;