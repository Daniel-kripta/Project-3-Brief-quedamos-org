import styles from "./ContactPage.module.css"

export default function ContactPage() {
    return (
        <div className={styles.container}>
            <h1>Contacto</h1>

            <div className={styles.info}>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Email</span>
                    <a href="mailto:[EMAIL DE CONTACTO]">[EMAIL DE CONTACTO]</a>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Teléfono</span>
                    <span>[TELÉFONO]</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Dirección</span>
                    <span>Fundación Universitaria de Las Palmas<br />Juan de Quesada, 30<br />35001 Las Palmas de Gran Canaria</span>
                </div>
            </div>

            <div className={styles.map}>
                <iframe
                    title="Ubicación quedamos.org"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-15.4289%2C28.0966%2C-15.4089%2C28.1066&layer=mapnik&marker=28.1016%2C-15.4189"
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: "8px" }}
                    loading="lazy"
                />
                <a
                    href="https://www.openstreetmap.org/?mlat=28.1016&mlon=-15.4189#map=15/28.1016/-15.4189"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.osmLink}
                >
                    Ver mapa completo en OpenStreetMap
                </a>
            </div>
        </div>
    )
}
