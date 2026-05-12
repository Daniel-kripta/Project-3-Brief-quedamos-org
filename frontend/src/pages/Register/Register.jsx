import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useApi } from "../../hooks/useApi"

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" })
    const navigate = useNavigate()
    const { request, loading, error } = useApi()

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await request("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(form)
            })
            navigate("/login")
        } catch {}
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Crear cuenta</h1>
                {error && <p>{error}</p>}
                <label>
                    Nombre
                    <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label>
                    Email
                    <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
                </label>
                <label>
                    Contraseña
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </label>
                <label>
                    Rol
                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="USER">Persona usuaria</option>
                        <option value="ORGANIZER">Organizador/a</option>
                    </select>
                </label>
                <button type="submit" disabled={loading}>{loading ? "Registrando..." : "Registrarse"}</button>
                <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
            </form>
        </div>
    )
}