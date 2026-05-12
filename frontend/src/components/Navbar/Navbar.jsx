import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const{user, logout} = useAuth() 
    return (
        <nav>
            <Link to="/">quedamos.org</Link>

            {user ? (
                <div>
                    <span>{user.name}</span>
                    {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}
                    <Link to="/dashboard">Mi panel</Link>
                    <button onClick={logout}>Cerrar sesión</button>
                </div>
            ) : (
                <div>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Registrarse</Link>
                </div>
            )}
        </nav>
    )

}