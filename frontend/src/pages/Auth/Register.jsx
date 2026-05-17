import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useApi } from "../../hooks/useApi"
import styles from "./AuthForm.module.css"

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "USER" })
    const navigate = useNavigate()
    const { request, loading, error } = useApi()

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirmPassword) {
        return alert('Las contraseñas no coinciden')
    }

        try {
            await request("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(form)
            })
            navigate("/login")
        } catch {}
    }

    return (
        <div className={styles.loginContainer}>
            <form className={styles.formLogin} onSubmit={handleSubmit}>
                <h1>Crear cuenta</h1>
                {error && <p>{error}</p>}
                <label>
                    <span>Nombre:</span>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label>
                    <span>Email:</span>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
                </label>
                <label>
                    <span>Contraseña:</span>
                    <input type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required />
                </label>
                <label>
                    <span>Confirmar contraseña:</span>
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} minLength={6} required />
                </label>

                <label>
                    <span>Rol:</span>
                    <select name="role" value={form.role} onChange={handleChange} style={{width: "70%"}}>
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