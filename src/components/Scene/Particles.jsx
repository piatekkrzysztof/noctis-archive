import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 720 }) {
  const pts = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22
      arr[i * 3 + 1] = (Math.random() - 0.5) * 22
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22 - 6
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (!pts.current) return
    const t = clock.getElapsedTime()
    pts.current.rotation.y = t * 0.018
    pts.current.rotation.x = t * 0.009
  })

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#00e8ff" size={0.022} transparent opacity={0.35} />
    </points>
  )
}
