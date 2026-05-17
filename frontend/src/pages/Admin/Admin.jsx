import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useApi } from "../../hooks/useApi"
import API_URL from "../../api/config"
import styles from "./Admin.module.css"

export default function Admin() {
    const { request, loading, error } = useApi()
    const [users, setUsers] = useState([])
    const [events, setEvents] = useState([])
    const [userPage, setUserPage] = useState(1)
    const [userTotalPages, setUserTotalPages] = useState(1)
    const [eventPage, setEventPage] = useState(1)
    const [eventTotalPages, setEventTotalPages] = useState(1)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }
        fetch(`${API_URL}/api/admin/users?page=${userPage}&limit=10`, { headers })
            .then(r => r.json())
            .then(data => {
                setUsers(data.data || [])
                setUserTotalPages(data.totalPages || 1)
            })
    }, [userPage])

    useEffect(() => {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }
        fetch(`${API_URL}/api/admin/events?page=${eventPage}&limit=10`, { headers })
            .then(r => r.json())
            .then(data => {
                setEvents(data.data || [])
                setEventTotalPages(data.totalPages || 1)
            })
    }, [eventPage])

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
                <h2>Personas usuarias ({userTotalPages > 1 ? `página ${userPage}/${userTotalPages}` : users.length})</h2>
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
            {userTotalPages > 1 && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '1rem 0' }}>
                    <button onClick={() => setUserPage(p => p - 1)} disabled={userPage === 1}>← Anterior</button>
                    <span>{userPage} / {userTotalPages}</span>
                    <button onClick={() => setUserPage(p => p + 1)} disabled={userPage === userTotalPages}>Siguiente →</button>
                </div>
            )}
            </section>

            <section className={styles.section}>
                <h2>Eventos ({eventTotalPages > 1 ? `página ${eventPage}/${eventTotalPages}` : events.length})</h2>
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
            {eventTotalPages > 1 && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '1rem 0' }}>
                    <button onClick={() => setEventPage(p => p - 1)} disabled={eventPage === 1}>← Anterior</button>
                    <span>{eventPage} / {eventTotalPages}</span>
                    <button onClick={() => setEventPage(p => p + 1)} disabled={eventPage === eventTotalPages}>Siguiente →</button>
                </div>
            )}
            </section>
        </div>
    )
}
