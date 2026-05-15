import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../api/config";
import styles from "./EventDetail.module.css"

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { request, loading, error } = useApi();

  const [event, setEvent] = useState(null);
  const [isAttending, setIsAttending] = useState(false);
  
  const location = useLocation()

  useEffect(() => {
    fetch(`${API_URL}/api/events/${id}`)
      .then((r) => r.json())
      .then(setEvent);

    if (user) {
      fetch(`${API_URL}/api/events/${id}/attend`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((r) => r.json())
        .then(data => setIsAttending(data.attending))
    }
  }, [id, user]);

  const handleAttend = async () => {
    try {
      await request(`/api/events/${id}/attend`, { method: "POST" });
      setIsAttending(true);
      fetch(`${API_URL}/api/events/${id}`)
        .then((r) => r.json())
        .then(setEvent);
    } catch {}
  };

  const handleCancel = async () => {
    try {
      await request(`/api/events/${id}/attend`, { method: "DELETE" });
      setIsAttending(false);
      fetch(`${API_URL}/api/events/${id}`)
        .then((r) => r.json())
        .then(setEvent);
    } catch {}
  };

  return (
    <div className={styles.eventDetailDisplay} >
      {!event && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {event && (
        <>
          <h1 className={styles.titleEventDetail}>{event.title}</h1>
          <div>
              <div className={styles.imageEventDetail}>
              {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}
              <div className={styles.attendAndCategory}>
                <div>{event.category?.name}</div>
                <div>Vamos: {event._count?.attendances}{event.maxCapacity && <span>/{event.maxCapacity}</span>}
                </div>
              </div>
            </div>
          <div className={styles.actionsContainer}>
            {user &&
              (isAttending ? (
                <button onClick={handleCancel} disabled={loading}>
                  Cancelar asistencia
                </button>
              ) : (
                <button
                    onClick={handleAttend}
                    disabled={loading || (event.maxCapacity && event._count?.attendances >= event.maxCapacity)}
                >
                    {event.maxCapacity && event._count?.attendances >= event.maxCapacity ? "Aforo completo" : "Voy"}
                </button>
              ))}
            {!user && (
              <Link to="/login" state={{from: location}}><p className={styles.editButton}>
                <strong>Inicia sesión</strong> para confirmar asistencia
              </p></Link>
            )}
            {((user?.role === "ORGANIZER" && event.organizerId === user?.id) || user?.role === "ADMIN") && (
              <Link className={styles.editButton} to={`/events/${id}/edit`}>Editar evento</Link>
            )}
          </div>
          </div>
          <div className={styles.detailContainer}>
            <span>Detalles del evento:</span>
            <div className={styles.descriptionEventDetail}>{event.description}</div>
            <div>🗓 {new Date(event.date).toLocaleString("es-ES")}</div>
            <div>
              <span>📍 Lugar:</span>
              <div>{event.location}</div>
              <div>🏘 {event.area}</div>
            </div>
            <span>Organiza:</span>
            <div className={styles.organizerEventDetail}>{event.organizer?.name}</div>
          </div>
            {event.tags?.length > 0 && (
            <div>Tags: {event.tags.join(", ")}</div>
          )}
          {event.specialTags?.length > 0 && (
            <div>Etiquetas especiales: {event.specialTags.map(t => t.name).join(", ")}</div>
          )}

        </>
      )}
    </div>
  );
}
