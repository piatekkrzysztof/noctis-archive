import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Nav() {
  const sbRef = useRef()

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        if (sbRef.current)
          sbRef.current.style.width = (self.progress * 100).toFixed(2) + '%'
      },
    })
    return () => st.kill()
  }, [])

  const scrollTo = (id) => (e) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <>
      <div className="scroll-bar" aria-hidden="true">
        <div className="scroll-bar-inner" ref={sbRef} style={{ width: '0%' }} />
      </div>

      <nav className="nav" role="navigation" aria-label="Primary">
        <div className="nav-logo">NOCTIS</div>
        <div className="nav-links">
          <a href="#archive" onClick={scrollTo('archive')}>Archive</a>
          <a href="#about"   onClick={scrollTo('about')}>About</a>
          <a href="#contact" onClick={scrollTo('contact')}>Contact</a>
        </div>
        <div className="nav-tag">MMXXV / 01</div>
      </nav>
    </>
  )
}
