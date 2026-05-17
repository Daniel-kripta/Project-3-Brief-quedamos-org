import { Navigate, useParams } from "react-router-dom";
import staticPages from "../../config/staticPages";
import styles from "./StaticPage.module.css";

export default function StaticPage(){
    const {slug} = useParams()
    const staticPageItem = staticPages[slug]
    if (!staticPageItem) return <Navigate to="/" />
    return (
        <div className={styles.container}>
            <h1>{staticPageItem.title}</h1>
            {staticPageItem.paragraphs.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
        </div>
    )
}