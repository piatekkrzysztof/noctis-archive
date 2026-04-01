import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useStore from '../../store/useStore'

gsap.registerPlugin(ScrollTrigger)

export default function Manifesto() {
  const ref       = useRef()
  const textRef   = useRef()
  const prefersRM = useStore(s => s.prefersReducedMotion)

  useEffect(() => {
    if (prefersRM || !ref.current) return

    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 72%',
      onEnter: () => {
        gsap.from(textRef.current, {
          opacity: 0, y: 34, duration: 1.1, ease: 'power3.out',
        })
      },
    })
    return () => st.kill()
  }, [prefersRM])

  return (
    <section className="manifesto" ref={ref} aria-label="Manifesto">
      <div className="mf-wrap">
        <div className="sec-num">001 — Manifesto</div>
        <h2 className="mf-text" ref={textRef}>
          We capture what lives<br />
          <em>between frames</em> —<br />
          the brief luminescence<br />
          of digital thought.
        </h2>
      </div>
    </section>
  )
}
