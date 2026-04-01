import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import CapsuleMesh from './CapsuleMesh'
import Particles from './Particles'
import { PROJECTS } from '../../data/projects'
import useStore from '../../store/useStore'
import gsap from 'gsap'

/* ─────────────────────────────────────────────────────────────
   SceneInternals — lives inside <Canvas> so it can access
   useThree() for the camera reference
───────────────────────────────────────────────────────────── */
function SceneInternals({ scrollProgress }) {
  const { camera } = useThree()
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const openProject = useStore(s => s.openProject)
  const isMobile    = useStore(s => s.isMobile)
  const mouseRef    = useRef({ x: 0, y: 0, cx: 0, cy: 0 })
  const pl1Ref      = useRef()

  // BUG FIX #1: was useCallback()() — should be useEffect
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    const m = mouseRef.current
    m.cx += (m.x - m.cx) * 0.048
    m.cy += (m.y - m.cy) * 0.048

    // Camera parallax
    camera.position.x = m.cx * 0.42
    camera.position.y = m.cy * 0.28
    camera.position.z = 6.5 - scrollProgress * 2.6
    camera.lookAt(0, 0, 0)

    // Animated key light follows mouse
    if (pl1Ref.current) {
      pl1Ref.current.position.x = Math.sin(Date.now() * 0.0004) * 4 + m.cx * 3.2
      pl1Ref.current.position.y = Math.cos(Date.now() * 0.0003) * 3 + m.cy * 2
    }
  })

  // BUG FIX #4: camera resets when overlay closes — subscribe to Zustand
  useEffect(() => {
    return useStore.subscribe(
      (state) => state.activeProject,
      (project) => {
        if (!project) {
          gsap.to(camera.position, {
            x: 0, y: 0, z: 6.5,
            duration: 0.85, ease: 'power3.out',
          })
        }
      }
    )
  }, [camera])

  const handleClick = useCallback((project) => {
    // Wow factor: rush camera toward the capsule, then open overlay
    gsap.timeline()
      .to(camera.position, {
        x: project.pos[0] * 0.38,
        y: project.pos[1] * 0.38,
        z: project.pos[2] + 2.6,
        duration: 0.72,
        ease: 'power3.in',
      })
      .call(() => openProject(project))
  }, [camera, openProject])

  return (
    <>
      <ambientLight intensity={1.8} color="#080820" />
      <pointLight
        ref={pl1Ref}
        color="#00e8ff"
        intensity={3.5}
        distance={18}
        position={[3, 2, 4]}
      />
      <pointLight color="#ff5400" intensity={2.2} distance={14} position={[-4, -1, 3]} />
      <pointLight color="#8b2fff" intensity={1.8} distance={11} position={[0,   3, -2]} />

      {PROJECTS.map((p, i) => (
        <CapsuleMesh
          key={p.id}
          geoKey={p.geo}
          color={p.hex}
          basePos={p.pos}
          index={i}
          scrollProgress={scrollProgress}
          hovered={hoveredIdx === i}
          onClick={() => handleClick(p)}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredIdx(i) }}
          onPointerOut={() => setHoveredIdx(null)}
        />
      ))}

      <Particles count={isMobile ? 280 : 720} />

      {/* Drei perf helpers */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   Exported canvas wrapper
───────────────────────────────────────────────────────────── */
export default function ArchiveScene({ scrollProgress }) {
  const isMobile = useStore(s => s.isMobile)

  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 58, near: 0.1, far: 100 }}
      gl={{ antialias: !isMobile, alpha: true }}
      dpr={[1, isMobile ? 1.5 : 2]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'all' }}
    >
      <SceneInternals scrollProgress={scrollProgress} />
    </Canvas>
  )
}
