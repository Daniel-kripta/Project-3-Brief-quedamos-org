import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import API_URL from "../../api/config";
import styles from "./EventForm.module.css";

const today = new Date().toISOString().slice(0, 10)


export default function EventForm() {
  const { id } = useParams();
  const isEditMode = !!id;

  const navigate = useNavigate();

  const { request, loading, error } = useApi();

  const [categories, setCategories] = useState([]);
  const [hasRegistrationClose, setHasRegistrationClose] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: today,
    time: "",
    location: "",
    area: "",
    maxCapacity: "",
    minCapacity: "",
    imageUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 500) + 1}/800/1000`,
    categoryId: "",
    tags: [],
    registrationOpensDate: today,
    registrationOpensTime: "",
    registrationClosesDate: "",
    registrationClosesTime: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((r) => r.json())
      .then(setCategories);

    if (isEditMode) {
      fetch(`${API_URL}/api/events/${id}`)
        .then((r) => r.json())
        .then((event) => {
          if (event.registrationClosesAt) setHasRegistrationClose(true);
          setForm({
            title: event.title,
            description: event.description,
            date: event.date.slice(0, 10),
            time: event.date.slice(11, 16),
            location: event.location,
            area: event.area,
            maxCapacity: event.maxCapacity ?? "",
            minCapacity: event.minCapacity ?? "",
            imageUrl: event.imageUrl ?? "",
            categoryId: event.categoryId,
            tags: event.tags,
            registrationOpensDate: event.registrationOpensAt?.slice(0, 10) ?? today,
            registrationOpensTime: event.registrationOpensAt?.slice(11, 16) ?? "",
            registrationClosesDate: event.registrationClosesAt?.slice(0, 10) ?? "",
            registrationClosesTime: event.registrationClosesAt?.slice(11, 16) ?? "",
          });
        });
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleRadioPair = (pair, selected) => {
    setForm((prev) => ({
      ...prev,
      tags: [
        ...prev.tags.filter((t) => !pair.includes(t)),
        ...(selected ? [selected] : []),
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      date: `${form.date}T${form.time || "00:00"}:00.000Z`,
      location: form.location,
      area: form.area,
      categoryId: Number(form.categoryId),
      maxCapacity: form.maxCapacity !== "" ? Number(form.maxCapacity) : null,
      minCapacity: form.minCapacity !== "" ? Number(form.minCapacity) : null,
      imageUrl: form.imageUrl || undefined,
      tags: form.tags,
      registrationOpensAt: form.registrationOpensDate
        ? `${form.registrationOpensDate}T${form.registrationOpensTime || "00:00"}:00.000Z`
        : undefined,
      registrationClosesAt: hasRegistrationClose && form.registrationClosesDate
        ? `${form.registrationClosesDate}T${form.registrationClosesTime || "00:00"}:00.000Z`
        : undefined,
    };
    try {
      const saved = await request(
        isEditMode ? `/api/events/${id}` : "/api/events",
        { method: isEditMode ? "PUT" : "POST", body: JSON.stringify(payload) },
      );
      navigate(`/events/${saved.id}`);
    } catch {}
  };

  return (
    <div className={styles.eventFormContainer}>
      <h1>{isEditMode ? "Editar evento" : "Nuevo evento"}</h1>
      {error && <p>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Título
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descripción
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>

        <div className={styles.dateGroup}>
          <span>Fecha</span>
          <div className={styles.dateRow}>
            <input type="date" name="date" min={today} value={form.date} onChange={handleChange} required />
            <input type="time" name="time" value={form.time} onChange={handleChange} required />
          </div>
        </div>

        <label>
          Categoría
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          URL de imagen
          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </label>

        {form.imageUrl && (
          <img src={form.imageUrl} alt="Vista previa" className={styles.imagePreview} />
        )}

        <label>
          Lugar
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Área
          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Aforo máximo
          <input
            type="number"
            name="maxCapacity"
            value={form.maxCapacity}
            onChange={handleChange}
            min="1"
          />
        </label>

        <label>
          Aforo mínimo
          <input
            type="number"
            name="minCapacity"
            value={form.minCapacity}
            onChange={handleChange}
            min="1"
          />
        </label>

        <div className={styles.dateGroup}>
          <span>Apertura de inscripción</span>
          <div className={styles.dateRow}>
            <input type="date" name="registrationOpensDate" value={form.registrationOpensDate} onChange={handleChange} />
            <input type="time" name="registrationOpensTime" value={form.registrationOpensTime} onChange={handleChange} />
          </div>
        </div>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={hasRegistrationClose}
            onChange={e => setHasRegistrationClose(e.target.checked)}
          />
          <span>Con cierre de inscripción</span>
        </label>

        {hasRegistrationClose && (
          <div className={styles.dateGroup}>
            <span>Cierre de inscripción</span>
            <div className={styles.dateRow}>
              <input type="date" name="registrationClosesDate" value={form.registrationClosesDate} onChange={handleChange} />
              <input type="time" name="registrationClosesTime" value={form.registrationClosesTime} onChange={handleChange} />
            </div>
          </div>
        )}

        <div className={styles.toggleGroup}>
          <span>Coste de asistencia</span>
          <div className={styles.toggle}>
            <button type="button"
              className={`${styles.toggleBtn} ${form.tags.includes("paid") ? styles.toggleActive : ""}`}
              onClick={() => handleRadioPair(["paid", "free"], "paid")}>
              Pago
            </button>
            <button type="button"
              className={`${styles.toggleBtn} ${!form.tags.includes("paid") && !form.tags.includes("free") ? styles.toggleActive : ""}`}
              onClick={() => handleRadioPair(["paid", "free"], "")}>
              ·
            </button>
            <button type="button"
              className={`${styles.toggleBtn} ${form.tags.includes("free") ? styles.toggleActive : ""}`}
              onClick={() => handleRadioPair(["paid", "free"], "free")}>
              Gratuito
            </button>
          </div>
        </div>

        <div className={styles.toggleGroup}>
          <span>Espacio del evento</span>
          <div className={styles.toggle}>
            <button type="button"
              className={`${styles.toggleBtn} ${form.tags.includes("indoor") ? styles.toggleActive : ""}`}
              onClick={() => handleRadioPair(["indoor", "outdoor"], "indoor")}>
              Interior
            </button>
            <button type="button"
              className={`${styles.toggleBtn} ${!form.tags.includes("indoor") && !form.tags.includes("outdoor") ? styles.toggleActive : ""}`}
              onClick={() => handleRadioPair(["indoor", "outdoor"], "")}>
              ·
            </button>
            <button type="button"
              className={`${styles.toggleBtn} ${form.tags.includes("outdoor") ? styles.toggleActive : ""}`}
              onClick={() => handleRadioPair(["indoor", "outdoor"], "outdoor")}>
              Exterior
            </button>
          </div>
        </div>

        <div className={styles.toggleGroup}>
          <span>Otros</span>
          <div className={styles.pillRow}>
            <button type="button"
              className={`${styles.pill} ${form.tags.includes("beginner_friendly") ? styles.pillActive : ""}`}
              onClick={() => handleTagToggle("beginner_friendly")}>
              Apto para principiantes
            </button>
            <button type="button"
              className={`${styles.pill} ${form.tags.includes("collaboration") ? styles.pillActive : ""}`}
              onClick={() => handleTagToggle("collaboration")}>
              Colaboración
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? "Guardando..."
            : isEditMode
              ? "Guardar cambios"
              : "Crear evento"}
        </button>
      </form>
    </div>
  );
}
