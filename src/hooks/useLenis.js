import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

/**
 * Initialises Lenis smooth scroll and wires it to GSAP ScrollTrigger.
 *
 * FIX: gsap.ticker.remove() requires the EXACT same function reference
 * that was passed to add(). We cache the raf handler in a ref so the
 * cleanup can remove it correctly — arrow functions are never equal.
 */
export function useLenis() {
  const lenisRef   = useRef(null)
  const rafHandler = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration:    1.28,
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    // Keep GSAP ScrollTrigger in sync with Lenis position
    lenis.on('scroll', ScrollTrigger.update)

    // Cache the handler so we can remove the exact same reference
    rafHandler.current = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(rafHandler.current)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(rafHandler.current)
      lenis.destroy()
    }
  }, [])

  return lenisRef
}
