import { Link, Outlet, useNavigate } from "react-router";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { isUserCustomerOrGuest, isUserSignedIn, signOut } from "../functions/UserFunction";
import { MonoStyleText } from "../components/Text";

const headerItemStyle = "text-white p-4 transition hover:bg-white hover:text-black";

function IndexPage() {
    const navigate = useNavigate();

    return (
        <>
            <ResponsiveDiv style="flex flex-row justify-center items-center bg-black" children={<>
                    <header className="flex text-black">
                        <Link to="products"><MonoStyleText style={headerItemStyle} content="Products" /></Link>
                        {isUserCustomerOrGuest() && <Link to="cart"><MonoStyleText style={headerItemStyle} content="Cart" /></Link>}
                        <Link to="orders"><MonoStyleText style={headerItemStyle} content="Orders" /></Link>
                        <Link to="contacts"><MonoStyleText style={headerItemStyle} content="Contacts" /></Link>
                        <Link to="messages"><MonoStyleText style={headerItemStyle} content="Messages" /></Link>
                    </header>
                    {!isUserSignedIn() && 
                        <>
                            <Link to="signin"><MonoStyleText style={headerItemStyle} content="SIGN IN" /></Link>
                            <Link to="signup"><MonoStyleText style={headerItemStyle} content="SIGN UP" /></Link>
                        </>
                        ||
                        <>
                            <Link to="/user/edit"><MonoStyleText style={headerItemStyle} content={localStorage.getItem("username") as string} /></Link>
                            <button className={headerItemStyle + " font-mono"} onClick={() => {
                                signOut();
                                navigate("/");
                                window.location.reload();
                            }}>
                                SIGN OUT
                            </button>
                        </>
                    }
            </>} />
            <ResponsiveDiv style="bg-white w-full h-full" children={<main><Outlet /></main>} />
        </>
    )
}

export default IndexPage;