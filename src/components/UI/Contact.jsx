export default function Contact() {
  return (
    <>
      <section className="contact" id="contact" aria-label="Contact">
        <div className="ct-main">
          <div className="sec-num" style={{ marginBottom: '14px' }}>003 — Contact</div>
          <h2>
            Let&apos;s<br />
            <span className="outline">build</span><br />
            together.
          </h2>
          <div style={{ marginTop: '36px' }}>
            <a href="mailto:hello@noctis.studio" className="ct-link">
              hello@noctis.studio
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>© NOCTIS ARCHIVE MMXXV</span>
        <span>DARK MATTER STUDIO</span>
        <span>ALL RIGHTS RESERVED</span>
      </footer>
    </>
  )
}
