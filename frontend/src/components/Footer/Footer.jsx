import styles from "./Footer.module.css";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className={styles.logoFooter}>
        <img src="" alt="Logo quedamos.org" />
      </div>

      <div className={styles.socialIconsDiv}>
        <h4>Follow us [♥]</h4>
        <div>
          <a href="https://www.instagram.com/" target="_blank">
            <span className={`${styles.socialIcon} ${styles.socialIconFirst}`}>📸</span>
          </a>
          <a href="https://es.pinterest.com/" target="_blank">
            <span className={styles.socialIcon}>📌</span>
          </a>
          <a href="https://www.youtube.com/" target="_blank">
            <span className={styles.socialIcon}>🎬</span>
          </a>
          <a href="https://telegram.org/" target="_blank">
            <span className={styles.socialIcon}>✈️</span>
          </a>
          <a href="https://www.whatsapp.com" target="_blank">
            <span className={styles.socialIcon}>💬</span>
          </a>
        </div>
      </div>
      <div className={styles.legalInfo}>
        <div className={styles.infoWebPage}>
          <ul>
            <li>
              <NavLink to="/">Contact Us</NavLink>
            </li>
            <li>
              <NavLink to="/">Accessibility Statement</NavLink>
            </li>
            <li>
              <NavLink to="/">Legal Notice</NavLink>
            </li>
            <li>
              <NavLink to="/">Privacy Policy</NavLink>
            </li>
            <li>
              <NavLink to="/">Cookie Policy</NavLink>
            </li>
          </ul>
        </div>
        <div className={styles.signWeb}>© 2026 quedamos.org, Daniel-Kripta</div>
      </div>
    </footer>
  );
}
