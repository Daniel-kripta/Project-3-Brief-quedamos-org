import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { MenuIcon, CloseIcon } from "../../Icons/Icons"
import { useAuth } from "../../../context/AuthContext"
import styles from "./NavMenu.module.css"
import menu from "../Menu.module.css"

export default function NavMenu() {
    const [open, setOpen] = useState(false)
    const { user } = useAuth()
    const ref = useRef(null)

    const isOrganizer = user?.role === "ORGANIZER" || user?.role === "ADMIN"

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
            <button onClick={() => setOpen(!open)} className={menu.trigger}>
                {open ? <CloseIcon /> : <MenuIcon />}
            </button>
            {open && (
                <div className={menu.panel}>
                    <Link to="/" onClick={close}>Inicio</Link>
                    <Link to="/dashboard" onClick={close}>Mi panel</Link>
                    {isOrganizer && <Link to="/events/new" onClick={close}>Crear evento</Link>}
                </div>
            )}
        </div>
    )
}
