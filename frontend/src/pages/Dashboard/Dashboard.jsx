import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useApi } from "../../hooks/useApi"
import { useAuth } from "../../context/AuthContext"
import API_URL from "../../api/config"

export default function Dasboard(){

    const {user} = useAuth()
    const { request, loading, error } = useApi()
    const navigate = useNavigate()

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
    <div>
        <h1>Mi panel</h1>
        {error && <p>{error}</p>}

        {isOrganizer ? (
            <>
                <Link to="/events/new">Crear evento</Link>
                <h2>Mis eventos</h2>
                {myEvents.length === 0 && <p>Aún no has creado ningún evento.</p>}
                {myEvents.map(event => (
                    <div key={event.id}>
                        <Link to={`/events/${event.id}`}>{event.title}</Link>
                        <span> — {new Date(event.date).toLocaleDateString("es-ES")}</span>
                        <Link to={`/events/${event.id}/edit`}>Editar</Link>
                        <button onClick={() => handleDeleteEvent(event.id)} disabled={loading}>Borrar</button>
                    </div>
                ))}
            </>
        ) : (
            <>
                <h2>Mis eventos confirmados</h2>
                {myAttendances.length === 0 && <p>Aún no has confirmado asistencia a ningún evento.</p>}
                {myAttendances.map(attendance => (
                    <div key={attendance.id}>
                        <Link to={`/events/${attendance.eventId}`}>{attendance.event.title}</Link>
                        <span> — {new Date(attendance.event.date).toLocaleDateString("es-ES")}</span>
                        <button onClick={() => handleCancelAttendance(attendance.eventId)} disabled={loading}>Cancelar</button>
                    </div>
                ))}
            </>
        )}
    </div>
)

} 
