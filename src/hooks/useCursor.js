import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Tracks mouse position, animates the custom cursor ring,
 * and returns refs for dot + ring elements.
 */
export function useCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const pos     = useRef({ x: 0, y: 0, rx: 0, ry: 0 })

  useEffect(() => {
    const onMove = (e) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', onMove)

    let raf
    const tick = () => {
      pos.current.rx += (pos.current.x - pos.current.rx) * 0.1
      pos.current.ry += (pos.current.y - pos.current.ry) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = Math.round(pos.current.rx) + 'px'
        ringRef.current.style.top  = Math.round(pos.current.ry) + 'px'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const setActive = (v) => ringRef.current?.classList.toggle('active', v)

  return { dotRef, ringRef, setActive }
}
