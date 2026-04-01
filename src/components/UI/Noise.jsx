import { useEffect, useRef } from 'react'

export default function Noise() {
  const ref = useRef()
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 200
    const ctx = canvas.getContext('2d')
    const img = ctx.createImageData(200, 200)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0
      img.data[i] = img.data[i+1] = img.data[i+2] = v
      img.data[i+3] = 255
    }
    ctx.putImageData(img, 0, 0)
    if (ref.current) ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`
  }, [])

  return (
    <div ref={ref} aria-hidden="true" style={{
      position:'fixed', inset:0, zIndex:9999,
      pointerEvents:'none', opacity:0.032,
      backgroundRepeat:'repeat',
    }} />
  )
}
