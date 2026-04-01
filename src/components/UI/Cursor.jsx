import { useCursor } from '../../hooks/useCursor'

export default function Cursor() {
  const { dotRef, ringRef } = useCursor()

  return (
    <>
      <div className="cursor-dot"  ref={dotRef}  aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  )
}
