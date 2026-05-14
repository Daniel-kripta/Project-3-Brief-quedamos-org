import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useApi } from "../../hooks/useApi"
import API_URL from "../../api/config"

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
        <div>
            <h1>Panel de administración</h1>
            {error && <p>{error}</p>}

            <section>
                <h2>Personas usuarias</h2>
                {users.length === 0 && <p>No hay personas usuarias.</p>}
                {users.map(user => (
                    <div key={user.id}>
                        <span>{user.name} — {user.email} — {user.role}</span>
                        <button onClick={() => handleDeleteUser(user.id)} disabled={loading}>Borrar</button>
                    </div>
                ))}
            </section>

            <section>
                <h2>Eventos</h2>
                {events.length === 0 && <p>No hay eventos.</p>}
                {events.map(event => (
                    <div key={event.id}>
                        <Link to={`/events/${event.id}`}>{event.title}</Link>
                        <span> — {new Date(event.date).toLocaleDateString("es-ES")}</span>
                        <Link to={`/events/${event.id}/edit`}>Editar</Link>
                        <button onClick={() => handleDeleteEvent(event.id)} disabled={loading}>Borrar</button>
                    </div>
                ))}
            </section>
        </div>
    )
}
