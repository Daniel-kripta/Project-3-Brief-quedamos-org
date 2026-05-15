import ProjectIntro from "../../components/ProjectIntro/ProjectIntro"
import EventsListing from "../../components/EventsListing/EventsListing"

export default function Home() {
    return (
        <div>
            <section><ProjectIntro /></section>
            <section><EventsListing /></section>
        </div>
    )
}
