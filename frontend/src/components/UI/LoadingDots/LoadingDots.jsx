import styles from "./LoadingDots.module.css"

export default function LoadingDots({ text = "Cargando" }) {
    return (
        <p className={styles.loading}>
            {text}
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
        </p>
    )
}
