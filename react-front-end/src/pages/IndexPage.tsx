import { Link, Outlet, useNavigate } from "react-router";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { isUserSignedIn, SignOut } from "../functions/UserFunction";

const headerItemStyle = "text-white p-4 transition hover:bg-white hover:text-black";

function IndexPage() {
    const navigate = useNavigate();

    return (
        <>
            <ResponsiveDiv style="flex flex-row justify-center items-center bg-black" children={[
                <header className="flex text-black">
                    <Link to="products"><p className={headerItemStyle}>Products</p></Link>
                    <Link to="cart"><p className={headerItemStyle}>Cart</p></Link>
                    <Link to="orders"><p className={headerItemStyle}>Orders</p></Link>
                    <Link to="contacts"><p className={headerItemStyle}>Contacts</p></Link>
                    <Link to="messages"><p className={headerItemStyle}>Messages</p></Link>
                </header>,
                (!isUserSignedIn() && 
                    <>
                        <Link to="signin"><p className={headerItemStyle}>SIGN IN</p></Link>
                        <Link to="signup"><p className={headerItemStyle}>REGISTER</p></Link>
                    </>
                ) ||
                (
                    isUserSignedIn() && 
                    <>
                        <Link to="/user/edit"><p className={headerItemStyle}>{localStorage.getItem("username") as string}</p></Link>
                        <button className={headerItemStyle} onClick={() => {
                            SignOut();
                            navigate("/")
                        }}>
                            SIGN OUT
                        </button>
                    </>
                )
            ]} />
            <ResponsiveDiv style="bg-white w-full h-full" children={[(<main><Outlet /></main>)]} />
        </>
    )
}

export default IndexPage;