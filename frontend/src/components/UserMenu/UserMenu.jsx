import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { UserMenuIcon, CloseIcon } from "../Icons/Icons"
import styles from "./UserMenu.module.css"

export default function UserMenu() {
    const [open, setOpen] = useState(false)
    const { user, logout } = useAuth()
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const close = () => setOpen(false)

    return (
        <div ref={ref}>
            <button onClick={() => setOpen(!open)} className={styles.trigger}>
                {open ? <CloseIcon /> : <UserMenuIcon />}
            </button>
            {open && (
                <div className={styles.panel}>
                    {user ? (
                        <>
                            <span className={styles.userName}>{user.name}</span>
                            <Link to="/dashboard" onClick={close}>Mi panel</Link>
                            {user.role === "ADMIN" && <Link to="/admin" onClick={close}>Administración</Link>}
                            <button onClick={() => { logout(); close() }}>Cerrar sesión</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={close}>Iniciar sesión</Link>
                            <Link to="/register" onClick={close}>Registrarse</Link>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
