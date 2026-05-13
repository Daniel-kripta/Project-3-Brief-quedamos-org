import { Link } from "react-router-dom"
import { LogoShort } from "../Logos/Logos"
import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.infoFooter}>
        <div className={styles.brand}>
          <LogoShort className={styles.logo} />
          <div>Conoce más sobre nuestro proyecto</div>
        </div>

        <nav className={styles.links}>
          <Link to="/contacto">Contacto</Link>
          <Link to="/privacidad">Política de privacidad</Link>
          <Link to="/aviso-legal">Aviso legal</Link>
          <Link to="/accesibilidad">Accesibilidad</Link>
          <Link to="/denuncias">Denuncias sobre uso inapropiado</Link>

        </nav>
      </div>

      <div>©2026 quedamos.org / kripta.dev</div>
    </footer>
  )
}
