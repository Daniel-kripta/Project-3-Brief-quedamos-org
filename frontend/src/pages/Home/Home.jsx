import ProjectIntro from "../../components/ProjectIntro/ProjectIntro"
import Recommender from "../../components/Recommender/Recommender"
import EventsSection from "../../components/EventsSection/EventsSection"
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid"
import FeaturedEvents from "../../components/FeaturedEvents/FeaturedEvents"
import EventsListing from "../../components/EventsListing/EventsListing"

export default function Home() {

return (
    <div>
        <section><ProjectIntro/></section>
        <section><Recommender/></section>
        <section><EventsSection period="tonight" /></section>
        <section><EventsSection period="thisWeek" /></section>
        <section><CategoryGrid/></section>
        <section><FeaturedEvents/></section>
        <section><EventsListing/></section>
    </div>
)
}