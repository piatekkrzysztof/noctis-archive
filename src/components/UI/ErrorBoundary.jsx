import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[NOCTIS] Runtime error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: 'fixed', inset: 0,
          background: '#060608',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px', fontFamily: "'Share Tech Mono', monospace",
        }}>
          <div style={{ color: '#ff5400', fontSize: 11, letterSpacing: '.2em', marginBottom: 20 }}>
            RUNTIME ERROR
          </div>
          <pre style={{
            color: '#eeeef4', fontSize: 12, lineHeight: 1.7,
            maxWidth: 680, overflowX: 'auto',
            background: '#17171f', padding: '24px', borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack?.split('\n').slice(0, 8).join('\n')}
          </pre>
          <button
            style={{
              marginTop: 28, fontFamily: 'inherit', fontSize: 11,
              letterSpacing: '.16em', textTransform: 'uppercase',
              color: '#060608', background: '#00e8ff', border: 'none',
              padding: '12px 24px', cursor: 'pointer',
            }}
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
