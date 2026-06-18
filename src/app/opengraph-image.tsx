import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'Crisp Home Co. — Premium Residential Cleaning in Salt Lake City'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #1a2b4a 0%, #11203b 100%)',
          position: 'relative',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Subtle dot-grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage: 'radial-gradient(circle at 1px 1px, #b8c4a8 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Location pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(158,170,143,0.15)',
            border: '1px solid rgba(158,170,143,0.3)',
            borderRadius: '100px',
            padding: '8px 20px',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: '#9eaa8f', fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>
            Salt Lake City, Utah
          </span>
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontSize: 72,
            color: '#fffdf9',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: 16,
            fontWeight: 400,
          }}
        >
          Crisp Home Co.
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#9eaa8f',
            fontStyle: 'italic',
            marginBottom: 40,
          }}
        >
          &ldquo;Come home to crisp.&rdquo;
        </div>

        {/* Descriptor */}
        <div
          style={{
            fontSize: 20,
            color: 'rgba(184,196,168,0.7)',
            fontFamily: 'system-ui, sans-serif',
            fontStyle: 'normal',
            maxWidth: 560,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Flat-rate residential cleaning · Instant transparent pricing · Book in minutes
        </div>
      </div>
    ),
    { ...size }
  )
}
