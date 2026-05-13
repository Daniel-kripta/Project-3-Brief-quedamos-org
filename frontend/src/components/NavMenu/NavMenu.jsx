import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { MenuIcon, CloseIcon } from "../Icons/Icons"
import styles from "./NavMenu.module.css"

export default function NavMenu() {
    const [open, setOpen] = useState(false)
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
                {open ? <CloseIcon /> : <MenuIcon />}
            </button>
            {open && (
                <div className={styles.panel}>
                    <Link to="/" onClick={close}>Inicio</Link>
                </div>
            )}
        </div>
    )
}
