import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../api/config";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { request, loading, error } = useApi();

  const [event, setEvent] = useState(null);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/events/${id}`)
      .then((r) => r.json())
      .then(setEvent);

    if (user) {
      fetch(`${API_URL}/api/users/me/attendances`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((r) => r.json())
        .then((attendances) => {
          setIsAttending(attendances.some((a) => a.eventId === Number(id)));
        });
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
    <div>
      {!event && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {event && (
        <>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <p>Organiza: {event.organizer?.name}</p>
          <p>{new Date(event.date).toLocaleString("es-ES")}</p>
          <p>
            {event.location} — {event.area}
          </p>
          <p>Categoría: {event.category?.name}</p>
          {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}
          <p>Vamos: {event._count?.attendances}</p>
          {event.maxCapacity && <p>Aforo máximo: {event.maxCapacity}</p>}
          {event.tags?.length > 0 && (
            <p>Tags: {event.tags.join(", ")}</p>
          )}
          {event.specialTags?.length > 0 && (
            <p>Etiquetas especiales: {event.specialTags.map(t => t.name).join(", ")}</p>
          )}

          {user &&
            (isAttending ? (
              <button onClick={handleCancel} disabled={loading}>
                Cancelar asistencia
              </button>
            ) : (
              <button onClick={handleAttend} disabled={loading}>
                Voy
              </button>
            ))}
          {!user && (
            <p>
              <Link to="/login">Inicia sesión</Link> para confirmar asistencia
            </p>
          )}

          {((user?.role === "ORGANIZER" && event.organizerId === user?.id) || user?.role === "ADMIN") && (
            <Link to={`/events/${id}/edit`}>Editar evento</Link>
          )}
        </>
      )}
    </div>
  );
}
