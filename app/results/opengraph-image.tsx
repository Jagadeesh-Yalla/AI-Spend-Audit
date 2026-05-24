// app/results/[id]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AI Spend Audit Results';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ color: '#6366f1', fontSize: 28, marginBottom: 16 }}>
          🔍 AI Spend Audit
        </div>
        <div style={{ color: 'white', fontSize: 56, fontWeight: 900, textAlign: 'center' }}>
          See where your team
        </div>
        <div style={{ color: 'white', fontSize: 56, fontWeight: 900, textAlign: 'center' }}>
          overpays for AI tools
        </div>
        <div style={{ color: '#a5b4fc', fontSize: 24, marginTop: 24 }}>
          Free audit · No login required · Results in 2 minutes
        </div>
        <div
          style={{
            background: '#6366f1',
            color: 'white',
            padding: '12px 32px',
            borderRadius: 12,
            fontSize: 20,
            fontWeight: 700,
            marginTop: 32,
          }}
        >
          ai-spend-audit-gamma-pearl.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}