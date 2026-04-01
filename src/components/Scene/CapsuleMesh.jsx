import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { capsuleVert, capsuleFrag } from '../../shaders/shaders'

const GEO_MAP = {
  torusKnot:    () => new THREE.TorusKnotGeometry(0.62, 0.18, 96, 14),
  icosahedron:  () => new THREE.IcosahedronGeometry(0.74, 1),
  octahedron:   () => new THREE.OctahedronGeometry(0.74, 0),
  torus:        () => new THREE.TorusGeometry(0.62, 0.22, 14, 58),
  dodecahedron: () => new THREE.DodecahedronGeometry(0.66, 0),
  sphere:       () => new THREE.SphereGeometry(0.66, 18, 18),
}

export default function CapsuleMesh({
  geoKey, color, basePos, index,
  scrollProgress, hovered,
  onClick, onPointerOver, onPointerOut,
}) {
  const meshRef  = useRef()
  const { camera } = useThree()
  const scaleVec = useMemo(() => new THREE.Vector3(1, 1, 1), [])

  const geometry = useMemo(() => GEO_MAP[geoKey](), [geoKey])

  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uColor:  { value: new THREE.Color(color) },
    uGlow:   { value: 1.0 },
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
    const t   = clock.getElapsedTime()
    const dir = index % 2 ? 1 : -1

    meshRef.current.rotation.x = t * (0.14 + index * 0.03) * dir
    meshRef.current.rotation.y = t * (0.19 + index * 0.04)

    const sp = scrollProgress
    meshRef.current.position.x = basePos[0] + Math.sin(sp * Math.PI * 0.5 + index) * sp * 1.2
    meshRef.current.position.y = basePos[1] + sp * (index % 2 ? 0.48 : -0.48)
    meshRef.current.position.z = basePos[2] - sp * 1.4

    uniforms.uTime.value = t
    uniforms.uCamPos.value.copy(camera.position)

    const targetGlow = hovered ? 2.8 : 1.0
    uniforms.uGlow.value += (targetGlow - uniforms.uGlow.value) * 0.08

    const ts = hovered ? 1.08 : 1.0
    scaleVec.set(ts, ts, ts)
    meshRef.current.scale.lerp(scaleVec, 0.08)
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={basePos}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  )
}
