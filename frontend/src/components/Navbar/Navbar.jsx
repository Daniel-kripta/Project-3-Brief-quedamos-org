import { Link } from "react-router-dom"
import { Logo } from "../Logos/Logos"
import UserMenu from "../Menu/UserMenu/UserMenu"
import NavMenu from "../Menu/NavMenu/NavMenu"
import { useAuth } from "../../context/AuthContext"
import styles from "./Navbar.module.css"

export default function Navbar() {
    const { user } = useAuth()
    const isOrganizer = user?.role === "ORGANIZER" || user?.role === "ADMIN"

    return (
        <header className={styles.navHeader}>
            <nav className={styles.nav}>
                <Link to="/"><Logo className={styles.logoHeader}/></Link>
                <div className={styles.icons}>
                    {isOrganizer && (
                        <Link to="/events/new" className={styles.btnCreate}>+</Link>
                    )}
                    <UserMenu />
                    <NavMenu />
                </div>
            </nav>
        </header>
    )
}
