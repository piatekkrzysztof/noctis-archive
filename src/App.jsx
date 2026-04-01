import { useLenis }     from './hooks/useLenis'
import ErrorBoundary    from './components/UI/ErrorBoundary'
import Cursor           from './components/UI/Cursor'
import NoiseOverlay     from './components/UI/NoiseOverlay'
import Nav              from './components/UI/Nav'
import Hero             from './components/Hero/Hero'
import Manifesto        from './components/UI/Manifesto'
import ArchiveGrid      from './components/UI/ArchiveGrid'
import About            from './components/UI/About'
import Contact          from './components/UI/Contact'
import ProjectOverlay   from './components/UI/ProjectOverlay'

export default function App() {
  useLenis()

  return (
    <ErrorBoundary>
      <NoiseOverlay />
      <Cursor />
      <Nav />
      <main>
        {/* Hero has its own inner ErrorBoundary so a 3D crash doesn't kill the page */}
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
        <Manifesto />
        <ArchiveGrid />
        <About />
        <Contact />
      </main>
      <ProjectOverlay />
    </ErrorBoundary>
  )
}
