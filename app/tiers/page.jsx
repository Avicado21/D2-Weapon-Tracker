// app/tiers/page.jsx — Tier list page
import Link from 'next/link'
import { TIER_LIST } from '@/lib/patchData'

const TIER_CONFIG = {
  S: { label: 'S Tier — Absolute Meta', color: '#ffd700', bg: '#ffd70012' },
  A: { label: 'A Tier — Highly Viable', color: '#ff8c42', bg: '#ff8c4212' },
  B: { label: 'B Tier — Solid Pick', color: '#4caf7a', bg: '#4caf7a12' },
  C: { label: 'C Tier — Situational', color: '#4a9eff', bg: '#4a9eff12' },
  D: { label: 'D Tier — Struggle Bus', color: '#4a5060', bg: '#4a506012' },
}

export const metadata = {
  title: 'Tier List — D2 Weapon Tracker',
  description: 'Destiny 2 weapon tier list after the Monument of Triumph June 9, 2026 update.',
}

export default function TiersPage() {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#e8eaf0', marginBottom: '4px' }}>
          Weapon Tier List
        </h1>
        <p style={{ fontSize: '13px', color: '#8a92a6' }}>
          Post-Monument of Triumph sandbox · June 9, 2026 · Based on PvE viability
        </p>
      </div>

      {Object.entries(TIER_LIST).map(([tier, weapons]) => {
        const config = TIER_CONFIG[tier]
        return (
          <div key={tier} style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: config.bg,
              borderLeft: `4px solid ${config.color}`,
              padding: '8px 14px', borderRadius: '0 6px 6px 0',
              marginBottom: '10px',
            }}>
              <span style={{
                fontSize: '20px', fontWeight: 800, color: config.color,
                minWidth: '24px', textAlign: 'center',
              }}>{tier}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: config.color }}>
                {config.label}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '8px',
            }}>
              {weapons.map(weapon => (
                <div key={weapon.name} style={{
                  background: '#161920',
                  border: `1px solid ${weapon.rarity === 'Exotic' ? '#c89b3c20' : 'rgba(255,255,255,0.05)'}`,
                  borderLeft: `3px solid ${weapon.rarity === 'Exotic' ? '#c89b3c' : '#8a6bbf'}`,
                  borderRadius: '8px',
                  padding: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8eaf0', lineHeight: '1.3' }}>
                        {weapon.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8a92a6', marginTop: '2px' }}>
                        {weapon.type} ·{' '}
                        <span style={{ color: weapon.rarity === 'Exotic' ? '#c89b3c' : '#8a6bbf', fontWeight: 600 }}>
                          {weapon.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                  {weapon.reason && (
                    <p style={{ fontSize: '12px', color: '#4a5060', lineHeight: '1.5' }}>
                      {weapon.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div style={{
        marginTop: '2rem', padding: '1rem', background: '#161920',
        border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px',
        fontSize: '12px', color: '#4a5060', lineHeight: '1.7',
      }}>
        ℹ️ Tier list reflects the final MoT sandbox. PvP tier list varies — see individual weapon pages for PvP notes.
        Data sourced from Bungie Dev Insights (May 29, 2026) and the Monument of Triumph announcement (May 21, 2026).
      </div>
    </div>
  )
}
