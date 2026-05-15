import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useApi } from "../../hooks/useApi"
import API_URL from "../../api/config"
import styles from "./Admin.module.css"

export default function Admin() {
    const { request, loading, error } = useApi()
    const [users, setUsers] = useState([])
    const [events, setEvents] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        fetch(`${API_URL}/api/admin/users`, { headers })
            .then(r => r.json())
            .then(setUsers)

        fetch(`${API_URL}/api/admin/events`, { headers })
            .then(r => r.json())
            .then(setEvents)
    }, [])

    const handleDeleteUser = async (userId) => {
        if (!confirm("¿Seguro que quieres borrar esta persona usuaria?")) return
        try {
            await request(`/api/admin/users/${userId}`, { method: "DELETE" })
            setUsers(prev => prev.filter(u => u.id !== userId))
        } catch {}
    }

    const handleDeleteEvent = async (eventId) => {
        if (!confirm("¿Seguro que quieres borrar este evento?")) return
        try {
            await request(`/api/events/${eventId}`, { method: "DELETE" })
            setEvents(prev => prev.filter(e => e.id !== eventId))
        } catch {}
    }

    return (
        <div className={styles.adminContainer}>
            <h1>Panel de administración</h1>
            {error && <p>{error}</p>}

            <section className={styles.section}>
                <h2>Personas usuarias ({users.length})</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td data-label="Nombre">{user.name}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Rol">{user.role}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.btnDelete}
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={loading}>
                                            Borrar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className={styles.section}>
                <h2>Eventos ({events.length})</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Fecha</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id}>
                                <td data-label="Título">
                                    <Link to={`/events/${event.id}`}>{event.title}</Link>
                                </td>
                                <td data-label="Fecha">{new Date(event.date).toLocaleDateString("es-ES")}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <Link to={`/events/${event.id}/edit`} className={styles.btnEdit}>
                                            Editar
                                        </Link>
                                        <button
                                            className={styles.btnDelete}
                                            onClick={() => handleDeleteEvent(event.id)}
                                            disabled={loading}>
                                            Borrar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    )
}
