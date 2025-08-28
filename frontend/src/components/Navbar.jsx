import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const { user, clearUser } = useStore();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Top Navbar */}
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/">Harvest Hub</Link>
                </div>

                {/* Desktop Links */}
                <div className="navbar-links desktop-only">
                    <Link to="/products">Products</Link>
                    <Link to="/cart">Cart</Link>
                    {user ? (
                        <>
                            <Link to="/orders">Orders</Link>
                            <button className="logout-btn" onClick={clearUser}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>

                {/* Mobile Menu Icon */}
                <div className="mobile-only">
                    <button className="menu-btn" onClick={toggleSidebar}>
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </nav>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? "open" : ""}`} style={{display:isOpen ? "flex" : "none"}}>
                <Link to="/products" onClick={toggleSidebar}>Products</Link>
                <Link to="/cart" onClick={toggleSidebar}>Cart</Link>
                {user ? (
                    <>
                        <Link to="/orders" onClick={toggleSidebar}>Orders</Link>
                        <button className="logout-btn" onClick={() => { clearUser(); toggleSidebar(); }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" onClick={toggleSidebar}>Login</Link>
                )}
            </div>

            {/* Overlay */}
            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </>
    );
};

export default Navbar;
