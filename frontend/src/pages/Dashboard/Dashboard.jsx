import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useApi } from "../../hooks/useApi"
import { useAuth } from "../../context/AuthContext"
import API_URL from "../../api/config"
import styles from "./Dashboard.module.css"

export default function Dashboard() {
    const { user } = useAuth()
    const { request, loading, error } = useApi()

    const isOrganizer = user?.role === "ORGANIZER" || user?.role === "ADMIN"

    const [myEvents, setMyEvents] = useState([])
    const [myAttendances, setMyAttendances] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        if (isOrganizer) {
            fetch(`${API_URL}/api/users/me/events`, { headers })
                .then(r => r.json())
                .then(setMyEvents)
        } else {
            fetch(`${API_URL}/api/users/me/attendances`, { headers })
                .then(r => r.json())
                .then(setMyAttendances)
        }
    }, [isOrganizer])

    const handleDeleteEvent = async (eventId) => {
        if (!confirm("¿Seguro que quieres borrar este evento?")) return
        try {
            await request(`/api/events/${eventId}`, { method: "DELETE" })
            setMyEvents(prev => prev.filter(e => e.id !== eventId))
        } catch {}
    }

    const handleCancelAttendance = async (eventId) => {
        try {
            await request(`/api/events/${eventId}/attend`, { method: "DELETE" })
            setMyAttendances(prev => prev.filter(a => a.eventId !== eventId))
        } catch {}
    }

    return (
        <div className={styles.dashboardContainer}>
            <h1>Mi panel</h1>
            {error && <p>{error}</p>}

            {isOrganizer ? (
                <section>
                    <div className={styles.header}>
                        <h2>Mis eventos ({myEvents.length})</h2>
                        <Link to="/events/new" className={styles.btnNew}>Crear evento</Link>
                    </div>
                    {myEvents.length === 0
                        ? <p>Aún no has creado ningún evento.</p>
                        : <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Fecha</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {myEvents.map(event => (
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
                                                    className={styles.btnCancel}
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
                    }
                </section>
            ) : (
                <section>
                    <h2>Mis eventos confirmados ({myAttendances.length})</h2>
                    {myAttendances.length === 0
                        ? <p>Aún no has confirmado asistencia a ningún evento.</p>
                        : <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Fecha</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {myAttendances.map(attendance => (
                                    <tr key={attendance.id}>
                                        <td data-label="Título">
                                            <Link to={`/events/${attendance.eventId}`}>{attendance.event.title}</Link>
                                        </td>
                                        <td data-label="Fecha">{new Date(attendance.event.date).toLocaleDateString("es-ES")}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.btnCancel}
                                                    onClick={() => handleCancelAttendance(attendance.eventId)}
                                                    disabled={loading}>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </section>
            )}
        </div>
    )
}
