import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../../components/Logos/Logos"
import styles from "./Navbar.module.css"

export default function Navbar() {
    const{user, logout} = useAuth() 
    return (
        <nav>
            <Link to="/"><Logo className={styles.logoHeader}/></Link>

            <div className={styles.headerLinks}>

            {user ? (
                <div>
                    <span>{user.name}</span>
                    {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}
                    <Link to="/dashboard">Mi panel</Link>
                    <button onClick={logout}>Cerrar sesión</button>
                </div>
            ) : (
                <div className={styles.noUserMenu}>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Registrarse</Link>
                </div>
            )}

            <div>Menu</div>

            </div>


        </nav>
    )

}