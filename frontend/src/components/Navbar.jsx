import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";

const Navbar = () => {
    const { user, clearUser } = useStore();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Harvest Hub</Link>
            </div>
            <div className="navbar-links">
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
        </nav>
    );
};

export default Navbar;
