import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import styles from "./ProjectIntro.module.css"

export default function ProjectIntro() {
    const { user } = useAuth()

    return (
        <div className={styles.intro}>
            <h2>Te damos la bienvenida a quedamos.org</h2>
            {!user && (
                <>
                    <p>
                        quedamos.org forma parte de un proyecto social destinado a mejorar la calidad de vida
                        de las personas a través de la reconstrucción del tejido social. La plataforma facilita
                        la gestión de eventos para entidades sociales y a particulares, al tiempo que ayuda a
                        encontrar espacios de encuentro atendiendo a la diversidad de las personas.
                    </p>
                    <p>
                        Parte de un compromiso claro con la ética digital: sin patrones oscuros, sin algoritmos
                        de retención ni dinámicas del capitalismo de vigilancia — solo el contacto presencial
                        entre personas, libre de filtros y estímulos perjudiciales.
                    </p>
                    <p>
                        Pensada para toda la ciudadanía, con especial atención a colectivos con mayores
                        dificultades de participación social: personas mayores, con discapacidad, en
                        situación de exclusión social. También un espacio para que entidades del tercer sector
                        y pequeños comercios visibilicen sus iniciativas más allá de sus redes habituales.
                    </p>
                    <p>
                        Esta es la Fase 1 de un proyecto concebido para crecer. Cubre los casos de uso
                        centrales: descubrir y filtrar eventos, confirmar asistencia, y gestionar eventos
                        propios como entidad organizadora. Las fases siguientes incorporarán coordinación
                        social, funcionalidades de accesibilidad y un ecosistema de servicios más amplio.
                    </p>
                </>
            )}
            <Link to="/info/sobre-el-proyecto" className={styles.link}>Saber más sobre el proyecto</Link>
        </div>
    )
}
