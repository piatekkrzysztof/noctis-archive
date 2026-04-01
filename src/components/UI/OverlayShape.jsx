import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { capsuleVert, capsuleFrag } from '../../shaders/shaders'

const GEO_MAP = {
  torusKnot:    () => new THREE.TorusKnotGeometry(0.88, 0.26, 128, 16),
  icosahedron:  () => new THREE.IcosahedronGeometry(1.0, 1),
  octahedron:   () => new THREE.OctahedronGeometry(1.0, 0),
  torus:        () => new THREE.TorusGeometry(0.88, 0.30, 16, 72),
  dodecahedron: () => new THREE.DodecahedronGeometry(0.92, 0),
  sphere:       () => new THREE.SphereGeometry(0.92, 32, 32),
}

/* ── Inner mesh — needs useFrame so must live inside Canvas ── */
function ShapeMesh({ geoKey, color }) {
  const meshRef = useRef()
  const { camera } = useThree()

  const geometry = useMemo(() => GEO_MAP[geoKey]?.() ?? GEO_MAP.sphere(), [geoKey])

  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uColor:  { value: new THREE.Color(color) },
    uGlow:   { value: 2.2 },
    uCamPos: { value: new THREE.Vector3() },
  }), [color])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   capsuleVert,
    fragmentShader: capsuleFrag,
    uniforms,
    transparent: true,
    side:        THREE.DoubleSide,
    depthWrite:  false,
  }), [uniforms])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.18
    meshRef.current.rotation.y = t * 0.26
    uniforms.uTime.value   = t
    uniforms.uCamPos.value.copy(camera.position)
  })

  return <mesh ref={meshRef} geometry={geometry} material={material} />
}

/* ── Canvas wrapper exported to ProjectOverlay ── */
export default function OverlayShape({ geoKey, color }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 52 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.6} color="#080820" />
      <pointLight color={color} intensity={4} distance={12} position={[2, 2, 3]} />
      <pointLight color="#ffffff" intensity={0.8} distance={10} position={[-3, -1, 2]} />
      <ShapeMesh geoKey={geoKey} color={color} />
    </Canvas>
  )
}
