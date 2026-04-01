import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import useStore from '../../store/useStore'

export default function HeroUI({ onEnter }) {
  const labelRef  = useRef()
  const line1Ref  = useRef()
  const line2Ref  = useRef()
  const subRef    = useRef()
  const ctaRef    = useRef()
  const statsRef  = useRef()
  const prefersRM = useStore(s => s.prefersReducedMotion)

  useEffect(() => {
    if (prefersRM) return

    gsap.set([labelRef.current, subRef.current, ctaRef.current, statsRef.current],
      { opacity: 0, y: 10 })
    gsap.set([line1Ref.current, line2Ref.current], { y: '112%' })

    const tl = gsap.timeline({ delay: 0.4 })
    tl.to(line1Ref.current,  { y: '0%',  duration: 0.95, ease: 'power4.out' })
      .to(line2Ref.current,  { y: '0%',  duration: 0.95, ease: 'power4.out' }, '-=0.68')
      .to(labelRef.current,  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .to(subRef.current,    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.28')
      .to(ctaRef.current,    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.28')
      .to(statsRef.current,  { opacity: 1, y: 0, duration: 0.65 }, '-=0.4')
  }, [prefersRM])

  return (
    <>
      <div className="hero-ui" aria-label="Hero content">
        <div className="hero-label" ref={labelRef}>Digital Archive / MMXXV</div>
        <h1 className="hero-h1">
          <span className="hl"><span className="hli" ref={line1Ref}>NOCTIS</span></span>
          <span className="hl ghost"><span className="hli" ref={line2Ref}>ARCHIVE</span></span>
        </h1>
        <p className="hero-sub" ref={subRef}>
          An exploration of objects at the intersection<br />
          of motion, light, and memory.
        </p>
        <div className="hero-actions" ref={ctaRef}>
          <button className="btn-primary" onClick={onEnter} aria-label="Enter the archive">
            Enter Archive
          </button>
          <span className="scroll-hint" aria-hidden="true">↓ Scroll</span>
        </div>
      </div>

      <div className="hero-stats" ref={statsRef} aria-label="Archive statistics">
        <div className="stat"><span className="stat-n">24</span><span className="stat-l">Objects</span></div>
        <div className="stat"><span className="stat-n">08</span><span className="stat-l">Series</span></div>
        <div className="stat"><span className="stat-n">∞</span><span className="stat-l">Depth</span></div>
      </div>
    </>
  )
}
