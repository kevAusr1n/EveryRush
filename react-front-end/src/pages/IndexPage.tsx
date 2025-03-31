import { Link, Outlet, useNavigate } from "react-router";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { isUserCustomerOrGuest, isUserSignedIn, signOut } from "../functions/UserFunction";
import { MonoStyleText } from "../components/Text";
import { useEffect, useState } from "react";

const headerItemStyle = "text-black p-4 transition hover:bg-black hover:text-white";

function IndexPage() {
    const navigate = useNavigate();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [headerDropDown, setHeaderDropDown] = useState(false);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth);
        })
        return () => {
            window.removeEventListener("resize", () => {
                setWindowWidth(window.innerWidth);
            })
        }
    }, []);

    return (
        <>
            <ResponsiveDiv style="flex flex-col md:flex-row justify-center items-center bg-white sticky top-0 z-999 shadow" eventHandlerMap={{onMouseLeave: () => {setHeaderDropDown(false)}, onClick: () => {setHeaderDropDown(!headerDropDown)}}} children={<>
                    {windowWidth < 768 && <ResponsiveDiv style="w-full flex flex-col items-center p-4 shadow" children={<p>MENU</p>} eventHandlerMap={{onClick: () => {setHeaderDropDown(!headerDropDown)}}} />}
                    {(windowWidth >= 768 || headerDropDown) && <header className={"flex flex-col md:flex-row text-black" + (windowWidth <= 768 ? " w-full text-center" : "")}>
                        <Link to="products"><MonoStyleText style={headerItemStyle} content="Products" /></Link>
                        {isUserCustomerOrGuest() && <Link to="cart"><MonoStyleText style={headerItemStyle} content="Cart" /></Link>}
                        <Link to="orders"><MonoStyleText style={headerItemStyle} content="Orders" /></Link>
                        <Link to="contacts"><MonoStyleText style={headerItemStyle} content="Contacts" /></Link>
                        <Link to="messages"><MonoStyleText style={headerItemStyle} content="Messages" /></Link>
                    </header>}
                    {(windowWidth >= 768 || headerDropDown) && (!isUserSignedIn() &&
                        <>
                            <Link className={windowWidth <= 768 ? " w-full text-center" : ""} to="signin"><MonoStyleText style={headerItemStyle} content="SIGN IN" /></Link>
                            <Link className={windowWidth <= 768 ? " w-full text-center" : ""} to="signup"><MonoStyleText style={headerItemStyle} content="SIGN UP" /></Link>
                        </>
                        ||
                        <>
                            <Link className={windowWidth <= 768 ? " w-full text-center" : ""} to="/user/edit"><MonoStyleText style={headerItemStyle} content={localStorage.getItem("username") as string} /></Link>
                            <button className={headerItemStyle + " font-mono" + (windowWidth <= 768 ? " w-full text-center" : "")} onClick={() => {
                                signOut();
                                navigate("/");
                                window.location.reload();
                            }}>
                                SIGN OUT
                            </button>
                        </>
                    )}
            </>} />
            <ResponsiveDiv style="bg-white w-full h-full" children={<main><Outlet /></main>} />
        </>
    )
}

export default IndexPage;