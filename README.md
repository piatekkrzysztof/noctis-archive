# NOCTIS ARCHIVE

> Dark futuristic immersive interactive experience  
> Stack: **React 18 + React Three Fiber + Drei + GLSL Shaders + Lenis + GSAP + Vite**

---

## Quick Start

```bash
# 1 — Install dependencies
npm install

# 2 — Dev server (hot reload)
npm run dev

# 3 — Production build
npm run build && npm run preview
```

Open **http://localhost:5173** in Chrome / Firefox.

---

## Architecture

```
src/
├── components/
│   ├── Hero/
│   │   ├── Hero.jsx          ← sticky scroll section, mounts Canvas + HeroUI
│   │   └── HeroUI.jsx        ← GSAP entrance animation for typography
│   ├── Scene/
│   │   ├── ArchiveScene.jsx  ← <Canvas> wrapper, SceneInternals (camera parallax)
│   │   ├── CapsuleMesh.jsx   ← per-object R3F mesh with custom ShaderMaterial
│   │   └── Particles.jsx     ← floating point cloud
│   └── UI/
│       ├── Archive.jsx       ← bento grid (12-col), scroll-stagger via GSAP
│       ├── About.jsx         ← reveal animations via ScrollTrigger
│       ├── Contact.jsx       ← contact + footer
│       ├── Cursor.jsx        ← custom dot + lagging ring cursor
│       ├── Manifesto.jsx     ← full-screen quote with ScrollTrigger
│       ├── Nav.jsx           ← fixed navigation
│       ├── Noise.jsx         ← canvas-generated grain overlay
│       ├── ProjectOverlay.jsx← WOW FACTOR — 3D→flat transition detail view
│       └── ScrollProgress.jsx← top progress bar
├── data/
│   └── projects.js           ← single source of truth for all project data
├── hooks/
│   ├── useLenis.js           ← Lenis init + GSAP ticker sync
│   └── useCursor.js          ← mouse tracking + ring lag
├── shaders/
│   ├── capsule.vert.glsl     ← passes normals/worldPos/uv to fragment
│   └── capsule.frag.glsl     ← Fresnel rim + scan lines + grid shimmer
├── store/
│   └── useStore.js           ← Zustand: activeProject, scrollProgress, flags
└── styles/
    └── globals.css           ← design tokens + all component styles
```

---

## Key Techniques

### GLSL Shader (Fresnel + scan lines)
`CapsuleMesh.jsx` uses a raw `THREE.ShaderMaterial` with `.vert.glsl` / `.frag.glsl`
files imported via `vite-plugin-glsl`. The fragment shader computes:

- **Fresnel rim** — `pow(1 - dot(N, viewDir), 2.8)` drives edge glow
- **Scan lines** — animated `sin(uv.y * 44 + uTime)` for retro CRT feel
- **Grid shimmer** — `max(|sin(u)|, |sin(v)|)` adds a fine mesh sheen

All driven by `uGlow` uniform, animated by GSAP in `CapsuleMesh.useFrame`.

### Lenis + GSAP ScrollTrigger sync
`useLenis.js` runs Lenis inside the **GSAP ticker** (`gsap.ticker.add`) and calls
`ScrollTrigger.update` on every `lenis.on('scroll')` event — this is the canonical
pattern for frame-perfect synchronisation between the two systems.

### Scroll-driven 3D camera
`Hero.jsx` creates a `ScrollTrigger` with `scrub: 2` that writes `scrollProgress`
to the Zustand store. `ArchiveScene` reads it each frame and moves the camera
(`z = 6.5 - progress * 2.6`) so the scene recedes as you scroll.

### Wow Factor — 3D → Flat transition
1. User **clicks** a capsule in the 3D scene → `handleClick` in `ArchiveScene`
2. GSAP timeline rushes `camera.position` toward the object (`power3.in`, 0.72 s)
3. Zustand `openProject(p)` mounts `<ProjectOverlay />`
4. Overlay fades in + content slides up (`translateY 52 → 0`)
5. Closing reverses: content slides down, overlay fades, camera restores to `[0,0,6.5]`

### Performance notes
- `<AdaptiveDpr />` from Drei dynamically lowers pixel ratio under GPU pressure
- `isMobile` flag halves the particle count and disables antialias on small screens
- `depthWrite: false` + `transparent: true` on the shader avoids z-fighting cost
- All GSAP animations target `transform`/`opacity` — no layout thrashing

---

## Extending

| Task | Where |
|---|---|
| Add a new project | `src/data/projects.js` — add an entry, choose a `geo` key |
| New geometry type  | `GEO_MAP` in `CapsuleMesh.jsx` |
| Tweak shader       | `src/shaders/capsule.frag.glsl` |
| Add a Case Study page | Create `src/pages/CaseStudy.jsx`, wire from `ProjectOverlay` |
| Replace Vite with Next.js | Move files to `app/` directory, convert `useLenis` to a client component |

---

## Accessibility

- `aria-label` on all interactive elements and sections
- `prefers-reduced-motion` respected in `useStore` — skips all GSAP animations
- Keyboard navigation: `Tab` to archive cards, `Enter`/`Space` to open, `Escape` to close overlay
- All 3D canvas content marked `aria-hidden="true"`
