import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import EventCard from "../EventCard/EventCard"
import API_URL from "../../api/config"
import style from "./EventsListing.module.css"
import LoadingDots from "../UI/LoadingDots/LoadingDots"

export default function EventsListing() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [events, setEvents] = useState([])
    const [categories, setCategories] = useState([])
    const [areas, setAreas] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const area = searchParams.get("area") || ""
    const categoryId = searchParams.get("categoryId") || ""

    useEffect(() => {
        fetch(`${API_URL}/api/categories`)
            .then(r => r.json())
            .then(setCategories)
    }, [])

    useEffect(() => {
    fetch(`${API_URL}/api/events/areas`)
        .then(r => r.json())
        .then(data => setAreas(Array.isArray(data) ? data : []))
    }, [])

    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams()
        if (area) params.append("area", area)
        if (categoryId) params.append("categoryId", categoryId)
        params.append("page", page)
        params.append("limit", 9)

        fetch(`${API_URL}/api/events?${params}`)
            .then(r => r.json())
            .then(data => {
                setEvents(data.data || [])
                setTotalPages(data.totalPages || 1)
            })
            .finally(() => setLoading(false))
    }, [area, categoryId, page])

    const handleAreaChange = e => {
        const next = new URLSearchParams(searchParams)
        if (e.target.value) next.set("area", e.target.value)
        else next.delete("area")
        setSearchParams(next)
        setPage(1)
    }

    const handleCategoryChange = e => {
        const next = new URLSearchParams(searchParams)
        if (e.target.value) next.set("categoryId", e.target.value)
        else next.delete("categoryId")
        setSearchParams(next)
        setPage(1)
    }

    const handleClear = () => {
        setSearchParams({})
        setPage(1)
    }

    return (
        <div>
            <h2>Todos los eventos</h2>
            <div className={style.eventsListingFilters}>
                <select value={categoryId} onChange={handleCategoryChange}>
                    <option value="">Todas las categorías</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <select value={area} onChange={handleAreaChange}>
                    <option value="">Todas las localizaciones</option>
                    {areas.map(a => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>

                <button onClick={handleClear}>Limpiar filtros</button>
            </div>

            {loading && <LoadingDots/> }
            {!loading && events.length === 0 && <p>No hay eventos con estos filtros.</p>}
            <div className={style.grid}>
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
            {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem' }}>
                    <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Anterior</button>
                    <span>{page} / {totalPages}</span>
                    <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Siguiente →</button>
                </div>
            )}
        </div>
    )
}
