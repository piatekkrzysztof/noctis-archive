import { useState, useEffect } from 'react'

/**
 * Generates a procedural noise texture once on mount and tiles it as
 * a fixed overlay. Uses useEffect+useState (not useMemo) so the canvas
 * operation runs after the DOM is ready — avoids SSR/StrictMode issues.
 */
export default function NoiseOverlay() {
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    const c   = document.createElement('canvas')
    c.width   = 200
    c.height  = 200
    const ctx = c.getContext('2d')
    if (!ctx) return
    const img = ctx.createImageData(200, 200)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
    setDataUrl(c.toDataURL())
  }, [])

  if (!dataUrl) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.032,
        backgroundImage: `url(${dataUrl})`,
        backgroundRepeat: 'repeat',
      }}
    />
  )
}
