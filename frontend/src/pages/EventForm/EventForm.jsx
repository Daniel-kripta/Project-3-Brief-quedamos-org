import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import API_URL from "../../api/config";

export default function EventForm() {
  const { id } = useParams();
  const isEditMode = !!id;

  const navigate = useNavigate();

  const { request, loading, error } = useApi();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    area: "",
    maxCapacity: "",
    minCapacity: "",
    imageUrl: "",
    categoryId: "",
    tags: [],
    registrationOpensAt: "",
    registrationClosesAt: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((r) => r.json())
      .then(setCategories);

    if (isEditMode) {
      fetch(`${API_URL}/api/events/${id}`)
        .then((r) => r.json())
        .then((event) => {
          setForm({
            title: event.title,
            description: event.description,
            date: event.date.slice(0, 16),
            location: event.location,
            area: event.area,
            maxCapacity: event.maxCapacity ?? "",
            minCapacity: event.minCapacity ?? "",
            imageUrl: event.imageUrl ?? "",
            categoryId: event.categoryId,
            tags: event.tags,
            registrationOpensAt: event.registrationOpensAt?.slice(0, 16) ?? "",
            registrationClosesAt:
              event.registrationClosesAt?.slice(0, 16) ?? "",
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
      ...form,
      date: form.date + ":00.000Z",
      categoryId: Number(form.categoryId),
      maxCapacity: form.maxCapacity !== "" ? Number(form.maxCapacity) : null,
      minCapacity: form.minCapacity !== "" ? Number(form.minCapacity) : null,
      registrationOpensAt: form.registrationOpensAt
        ? form.registrationOpensAt + ":00.000Z"
        : undefined,
      registrationClosesAt: form.registrationClosesAt
        ? form.registrationClosesAt + ":00.000Z"
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
    <div>
      <h1>{isEditMode ? "Editar evento" : "Nuevo evento"}</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
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

        <label>
          Fecha
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </label>

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

        <label>
          URL de imagen
          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </label>

        <label>
          Apertura de inscripción
          <input
            type="datetime-local"
            name="registrationOpensAt"
            value={form.registrationOpensAt}
            onChange={handleChange}
          />
        </label>

        <label>
          Cierre de inscripción
          <input
            type="datetime-local"
            name="registrationClosesAt"
            value={form.registrationClosesAt}
            onChange={handleChange}
          />
        </label>

        <fieldset>
          <legend>Precio</legend>
          <label>
            <input
              type="radio"
              name="paidFree"
              checked={
                !form.tags.includes("paid") && !form.tags.includes("free")
              }
              onChange={() => handleRadioPair(["paid", "free"], "")}
            />{" "}
            Sin especificar
          </label>
          <label>
            <input
              type="radio"
              name="paidFree"
              checked={form.tags.includes("paid")}
              onChange={() => handleRadioPair(["paid", "free"], "paid")}
            />{" "}
            De pago
          </label>
          <label>
            <input
              type="radio"
              name="paidFree"
              checked={form.tags.includes("free")}
              onChange={() => handleRadioPair(["paid", "free"], "free")}
            />{" "}
            Gratuito
          </label>
        </fieldset>

        <fieldset>
          <legend>Espacio</legend>
          <label>
            <input
              type="radio"
              name="indoorOutdoor"
              checked={
                !form.tags.includes("indoor") && !form.tags.includes("outdoor")
              }
              onChange={() => handleRadioPair(["indoor", "outdoor"], "")}
            />{" "}
            Sin especificar
          </label>
          <label>
            <input
              type="radio"
              name="indoorOutdoor"
              checked={form.tags.includes("indoor")}
              onChange={() => handleRadioPair(["indoor", "outdoor"], "indoor")}
            />{" "}
            Interior
          </label>
          <label>
            <input
              type="radio"
              name="indoorOutdoor"
              checked={form.tags.includes("outdoor")}
              onChange={() => handleRadioPair(["indoor", "outdoor"], "outdoor")}
            />{" "}
            Exterior
          </label>
        </fieldset>

        <fieldset>
          <legend>Otros</legend>
          <label>
            <input
              type="checkbox"
              checked={form.tags.includes("beginner_friendly")}
              onChange={() => handleTagToggle("beginner_friendly")}
            />{" "}
            Apto para principiantes
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.tags.includes("collaboration")}
              onChange={() => handleTagToggle("collaboration")}
            />{" "}
            Colaboración
          </label>
        </fieldset>

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
