import { Link } from "react-router-dom"

export default function ProjectIntro() {
    return (
        <div>
            <h2>Sobre nuestro proyecto</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <Link to="/sobre-el-proyecto">Saber más sobre el proyecto</Link>
        </div>
    )
}
