import { Link } from "react-router-dom"

export default function EventCard({ event }) {
    return (
        <div>
            {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}
            <h3><Link to={`/events/${event.id}`}>{event.title}</Link></h3>
            <p>{event.category?.name} — {event.area}</p>
            <p>{new Date(event.date).toLocaleDateString("es-ES")}</p>
            <p>Vamos: {event._count?.attendances}</p>
            {event.maxCapacity && <p>Aforo: {event._count?.attendances}/{event.maxCapacity}</p>}
        </div>
    )
}
