import { Link } from "react-router-dom"
import style from "./EventCard.module.css"


export default function EventCard({ event }) {

const eventDate = new Date(event.date)
const today = new Date()
const tomorrow = new Date()
tomorrow.setDate(today.getDate() + 1)

const isSameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()

const dateLabel = isSameDay(eventDate, today)
    ? "Hoy"
    : isSameDay(eventDate, tomorrow)
    ? "Mañana"
    : eventDate.toLocaleDateString("es-ES", { day: "numeric", month: "long" })





    return (
        <div className={style.eventCard}>
            <p className={style.dateEventCard}>{dateLabel}</p>
            <div className={style.imgContentCard}><Link to={`/events/${event.id}`}>{event.imageUrl && <img src={event.imageUrl} alt={event.title} />}</Link></div>
            <p className={style.timeCard}>{new Date(event.date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</p>
            <p className={style.categoryCard}>{event.category?.name}</p>
            <div className={style.infoContentCard}>
                <h3><Link to={`/events/${event.id}`}>{event.title}</Link></h3>
                <p>{event.area}</p>
                <div className={style.attendanceInfo}>
                    <div>Vamos: {event._count?.attendances}</div><div>{event.maxCapacity ? `Aforo: ${event._count?.attendances}/${event.maxCapacity}` : "Acceso libre"}</div>
                </div>
            </div>
        </div>
    )
}
