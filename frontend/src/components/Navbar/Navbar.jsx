import { Link } from "react-router-dom"
import { Logo } from "../Logos/Logos"
import UserMenu from "../UserMenu/UserMenu"
import NavMenu from "../NavMenu/NavMenu"
import styles from "./Navbar.module.css"

export default function Navbar() {
    return (
        <header className={styles.navHeader}>
            <nav className={styles.nav}>
                <Link to="/"><Logo className={styles.logoHeader}/></Link>
                <div className={styles.icons}>
                    <UserMenu />
                    <NavMenu />
                </div>
            </nav>
        </header>
    )
}
