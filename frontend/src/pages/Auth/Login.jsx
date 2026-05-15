import { useState } from "react"
import{useAuth} from "../../context/AuthContext" 
import{useNavigate, Link, useLocation} from "react-router-dom"
import{useApi} from "../../hooks/useApi" 
import styles from "./AuthForm.module.css"


export default function Login(){
    const [form, setForm] = useState({email:"", password:""}  )
    const{login} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const{request, loading, error} = useApi()

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) =>{
        e.preventDefault()

        try{
            const data = await request("/api/auth/login",{
                method: "POST",
                body: JSON.stringify(form)
            } )

            login(data.user, data.token)
            navigate(location.state?.from?.pathname || "/dashboard")


        } catch {} 

    }

    return (
        <div className={styles.loginContainer}>
            <form className={styles.formLogin} onSubmit={handleSubmit}>
                <h1>Iniciar sesión</h1>
                {error && <p>{error}</p>}
                <label>
                    <span>Email: </span>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
                </label>
                <label>
                    <span>Contraseña: </span>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </label>
                <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
                <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
            </form>
        </div>
    )     
}