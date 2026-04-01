import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import useStore from '../../store/useStore'
import OverlayShape from './OverlayShape'

export default function ProjectOverlay() {
  const activeProject = useStore(s => s.activeProject)
  const closeProject  = useStore(s => s.closeProject)
  const prefersRM     = useStore(s => s.prefersReducedMotion)

  const overlayRef  = useRef()
  const contentRef  = useRef()   // left text panel
  const shapeRef    = useRef()   // right 3D shape panel
  const lastProject = useRef(null)

  useEffect(() => {
    const ov      = overlayRef.current
    const content = contentRef.current
    const shape   = shapeRef.current
    if (!ov || !content || !shape) return

    if (activeProject) {
      lastProject.current = activeProject
      gsap.set(ov, { display: 'flex' })

      if (prefersRM) {
        gsap.set(ov,      { opacity: 1 })
        gsap.set(content, { opacity: 1, x: 0 })
        gsap.set(shape,   { opacity: 1, x: 0 })
        return
      }

      gsap.timeline()
        .fromTo(ov,
          { opacity: 0 },
          { opacity: 1, duration: 0.28, ease: 'power2.out' })
        .fromTo(content,
          { opacity: 0, x: -44 },
          { opacity: 1, x: 0,  duration: 0.7, ease: 'power3.out' },
          '-=0.05')
        .fromTo(shape,
          { opacity: 0, x: 44, scale: 0.88 },
          { opacity: 1, x: 0,  scale: 1, duration: 0.85, ease: 'power3.out' },
          '<0.08')

    } else {
      if (prefersRM) {
        gsap.set(ov, { display: 'none', opacity: 0 })
        lastProject.current = null
        return
      }

      gsap.timeline({
        onComplete: () => {
          gsap.set(ov, { display: 'none' })
          lastProject.current = null
        },
      })
        .to([content, shape], { opacity: 0, duration: 0.28, ease: 'power2.in', stagger: 0.06 })
        .to(ov,               { opacity: 0, duration: 0.22 }, '-=0.1')
    }
  }, [activeProject, prefersRM])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && activeProject) closeProject() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeProject, closeProject])

  const p = activeProject ?? lastProject.current

  return (
    <div
      className="overlay ov-split"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={p ? `Project: ${p.title}` : 'Project detail'}
      style={{ display: 'none', opacity: 0 }}
    >
      {/* ── LEFT — text content ── */}
      <div className="ov-content" ref={contentRef}>
        <button className="ov-back" onClick={closeProject} aria-label="Back to archive">
          ← Back
        </button>

        {p && (
          <>
            <div className="ov-num">{p.id}</div>

            <h2 className="ov-title">
              {p.title.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>

            <div className="ov-line" />

            <div className="ov-meta">
              <div><label>Type</label>  <span>{p.type}</span></div>
              <div><label>Year</label>  <span>{p.year}</span></div>
              <div><label>Medium</label><span>{p.medium}</span></div>
            </div>

            <p className="ov-desc">{p.desc}</p>

            <button className="btn-secondary">View Case Study →</button>
          </>
        )}
      </div>

      {/* ── RIGHT — live 3D shape ── */}
      <div className="ov-shape" ref={shapeRef} aria-hidden="true">
        {p && <OverlayShape geoKey={p.geo} color={p.color} />}

        {/* Accent glow blob behind the shape */}
        {p && (
          <div
            className="ov-glow"
            style={{ '--glow-col': p.color }}
          />
        )}
      </div>
    </div>
  )
}
