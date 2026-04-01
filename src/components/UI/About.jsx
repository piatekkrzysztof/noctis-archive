import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useStore from '../../store/useStore'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const ref       = useRef()
  const hRef      = useRef()
  const bodyRef   = useRef()
  const prefersRM = useStore(s => s.prefersReducedMotion)

  useEffect(() => {
    if (prefersRM || !ref.current) return

    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 76%',
      onEnter: () => {
        gsap.from(hRef.current,    { opacity: 0, x: -28, duration: 1.0, ease: 'power3.out' })
        gsap.from(bodyRef.current, { opacity: 0, x:  28, duration: 1.0, delay: 0.15, ease: 'power3.out' })
      },
    })
    return () => st.kill()
  }, [prefersRM])

  return (
    <section className="about" id="about" ref={ref} aria-label="About">
      <div className="ab-grid">
        <h2 ref={hRef}>Dark<br />Matter<br />Studio</h2>
        <div className="ab-body" ref={bodyRef}>
          <div className="sec-num" style={{ marginBottom: 22 }}>002 — About</div>
          <p>We exist at the intersection of interaction design, motion, and three-dimensional space. The archive documents our ongoing investigation into digital materiality.</p>
          <p>Each project is a capsule — a compressed moment of research, experimentation, and craft. We build things that feel inevitable, though nothing is.</p>
          <div className="ab-cols">
            <div><div className="ab-col-l">Based In</div>   <div className="ab-col-v">Berlin / Remote</div></div>
            <div><div className="ab-col-l">Active Since</div><div className="ab-col-v">2019</div></div>
            <div><div className="ab-col-l">Discipline</div>  <div className="ab-col-v">Motion + 3D + Web</div></div>
          </div>
        </div>
      </div>
    </section>
  )
}
