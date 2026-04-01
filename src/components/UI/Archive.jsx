import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS } from '../../data/projects'
import useStore from '../../store/useStore'

gsap.registerPlugin(ScrollTrigger)

export default function Archive() {
  const sectionRef  = useRef()
  const openProject = useStore(s => s.openProject)

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 82%',
      onEnter: () => {
        gsap.to('.arc-card', {
          opacity: 1, y: 0,
          duration: 0.75, stagger: 0.09, ease: 'power3.out',
        })
      },
    })
  }, { scope: sectionRef })

  return (
    <section className="archive" id="archive" ref={sectionRef} aria-label="Selected works">
      <div className="arc-head">
        <span className="sec-label">Selected Works</span>
        <h2>The Archive</h2>
      </div>
      <div className="arc-grid">
        {PROJECTS.map(p => (
          <article
            key={p.id}
            className="arc-card"
            style={{ '--card-hi': p.cardHi, opacity: 0, transform: 'translateY(28px)' }}
            tabIndex={0}
            role="button"
            aria-label={`Open ${p.title} project`}
            onClick={() => openProject(p)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openProject(p) }}
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
