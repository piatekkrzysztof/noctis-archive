import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * subscribeWithSelector middleware enables the selector form of .subscribe()
 * used in ArchiveScene to react to activeProject changes from outside React.
 */
const useStore = create(
  subscribeWithSelector((set) => ({
    activeProject: null,
    scrollProgress: 0,
    isMobile: typeof window !== 'undefined' && window.innerWidth < 768,
    prefersReducedMotion:
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    openProject:  (project) => set({ activeProject: project }),
    closeProject: ()        => set({ activeProject: null }),
    setScroll:    (v)       => set({ scrollProgress: v }),
  }))
)

export default useStore
