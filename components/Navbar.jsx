'use client'

import Link from 'next/link'

export default function NavBar() {
  return (
    <nav style={{
      background: '#0d0f14',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      height: '52px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>⚔️</span>
        <span style={{ fontWeight: 700, fontSize: '15px', color: '#e8eaf0', letterSpacing: '0.02em' }}>
          D2 Weapon Tracker
        </span>
        <span style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
          background: '#c89b3c22', color: '#c89b3c', border: '1px solid #c89b3c',
          padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase',
        }}>MoT Final</span>
      </Link>

      <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
        {[
          { href: '/', label: '🔫 Weapons' },
          { href: '/tiers', label: '🏆 Tier List' },
          { href: '/patches', label: '📋 Patch Feed' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            padding: '5px 12px', borderRadius: '6px', fontSize: '13px', color: '#8a92a6',
          }}>
            {label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4a5060' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4caf7a', display: 'inline-block' }}></span>
        Jun 9, 2026
      </div>
    </nav>
  )
}