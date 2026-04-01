import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ArchiveScene from '../Scene/ArchiveScene'
import HeroUI from './HeroUI'
import useStore from '../../store/useStore'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const heroRef    = useRef()
  const setScroll  = useStore(s => s.setScroll)
  const scrollProg = useStore(s => s.scrollProgress)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end:   'bottom top',
      scrub: 2,
      onUpdate: (self) => setScroll(self.progress),
    })
    return () => st.kill()
  }, [setScroll])

  // Lenis-compatible scroll: window.scrollTo is intercepted by Lenis
  const handleEnter = () => {
    const el = document.getElementById('archive')
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section className="hero" ref={heroRef} aria-label="Hero">
      <div className="hero-sticky">
        <div className="hero-canvas-wrap" aria-hidden="true">
          <ArchiveScene scrollProgress={scrollProg} />
        </div>
        <HeroUI onEnter={handleEnter} />
      </div>
    </section>
  )
}
