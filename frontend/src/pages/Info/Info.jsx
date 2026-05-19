import { useEffect, useState } from "react";

export default function Info() {
  const [html, setHtml] = useState(null);

  useEffect(() => {
  const cached = sessionStorage.getItem('readme-html')
  if (cached) {
    setHtml(cached)
    return
  }
  fetch(
    'https://api.github.com/repos/Daniel-kripta/Project-3-Brief-quedamos-org/contents/Fundamentación_APP.md',
    { headers: { Accept: 'application/vnd.github.html+json' } }
  )
    .then(r => r.text())
    .then(html => {
      sessionStorage.setItem('readme-html', html)
      setHtml(html)
    })
}, [])


  return (
    <>
      <p>Esta página forma parte del proyecto <strong>quedamos.org</strong>, desarrollado como entrega del Proyecto 3 del Bootcamp Fullstack de Ironhack (mayo 2026). El código fuente está disponible públicamente en <a href="https://github.com/Daniel-kripta/Project-3-Brief-quedamos-org" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
      <br />
      <br />
      <p style={{fontSize: '0.85rem', opacity: 0.6, marginTop: '-8px'}}>A continuación, se expone la fundamentación del proyecto.</p>
      <div className="markdown"
      dangerouslySetInnerHTML={{__html: html}}
    />
    </>
  );
}
