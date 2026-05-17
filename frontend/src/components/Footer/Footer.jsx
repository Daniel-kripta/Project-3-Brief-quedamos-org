import { Link } from "react-router-dom"
import { LogoShort } from "../Logos/Logos"
import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.infoFooter}>
        <div className={styles.brand}>
          <LogoShort className={styles.logo} />
          <div><Link to="/info/sobre-el-proyecto">Conoce más sobre nuestro proyecto</Link></div>
        </div>

        <nav className={styles.links}>
          <Link to="/info/contacto">Contacto</Link>
          <Link to="/info/politica-de-privacidad">Política de privacidad</Link>
          <Link to="/info/aviso-legal">Aviso legal</Link>
          <Link to="/info/accesibilidad">Accesibilidad</Link>
          <Link to="/info/denuncias">Denuncias sobre uso inapropiado</Link>

        </nav>
      </div>

      <div>©2026 quedamos.org / kripta.dev</div>
    </footer>
  )
}
