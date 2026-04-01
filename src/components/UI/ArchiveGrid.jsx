import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS } from '../../data/projects'
import useStore from '../../store/useStore'

gsap.registerPlugin(ScrollTrigger)

export default function ArchiveGrid() {
  const gridRef     = useRef()
  const openProject = useStore(s => s.openProject)
  const prefersRM   = useStore(s => s.prefersReducedMotion)

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.arc-card')
    if (!cards) return

    if (prefersRM) {
      gsap.set(cards, { opacity: 1, y: 0 })
      return
    }

    gsap.set(cards, { opacity: 0, y: 28 })

    const st = ScrollTrigger.create({
      trigger: gridRef.current,
      start: 'top 82%',
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.09,
          ease: 'power3.out',
        })
      },
    })

    return () => st.kill()
  }, [prefersRM])

  return (
    <section className="archive" id="archive" aria-label="Selected works">
      <div className="arc-head">
        <span className="sec-label">Selected Works</span>
        <h2>The Archive</h2>
      </div>

      <div className="arc-grid" ref={gridRef}>
        {PROJECTS.map((p) => (
          <article
            key={p.id}
            className="arc-card"
            style={{ '--card-hi': p.cardHi }}
            tabIndex={0}
            role="button"
            aria-label={`Open ${p.title} project`}
            onClick={() => openProject(p)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openProject(p)
            }}
          >
            <div className="c-idx">{p.id} — {p.year}</div>
            <h3 className="c-title">{p.title}</h3>
            <div className="c-type">{p.type}</div>
            <div className="c-view">↗ Open</div>
          </article>
        ))}
      </div>
    </section>
  )
}
