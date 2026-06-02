'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'

const CHANGE_COLORS = {
  buff: { color: '#4caf7a', label: '▲ Buff' },
  nerf: { color: '#e05252', label: '▼ Nerf' },
  rework: { color: '#4a9eff', label: '↺ Rework' },
  catalyst: { color: '#c89b3c', label: '⚗ Catalyst' },
  neutral: { color: '#4a5060', label: '—' },
}

const SOURCE_STYLES = {
  twid: { bg: '#4a9eff18', color: '#4a9eff', border: '#4a9eff30', label: 'TWID' },
  patchnotes: { bg: '#c89b3c18', color: '#c89b3c', border: '#c89b3c30', label: 'Patch Notes' },
  devinsight: { bg: '#8a6bbf18', color: '#8a6bbf', border: '#8a6bbf30', label: 'Dev Insight' },
}

export default function WeaponDetailPage({ params }) {
  const { hash } = use(params)
  const [weapon, setWeapon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/bungie/item/${hash}`)
      .then(r => r.json())
      .then(data => {
        if (!data.success) throw new Error(data.error)
        setWeapon(data.weapon)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [hash])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#4a9eff', fontSize: '14px' }}>
      ⏳ Loading weapon data…
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#e05252', fontSize: '14px' }}>
      ⚠️ {error}
      <br /><Link href="/" style={{ color: '#4a9eff', marginTop: '8px', display: 'block' }}>← Back to weapons</Link>
    </div>
  )

  if (!weapon) return null

  const isExotic = weapon.isExotic
  const changeInfo = CHANGE_COLORS[weapon.motChange] || CHANGE_COLORS.neutral

  return (
    <div style={{ maxWidth: '900px' }}>
      <Link href="/" style={{ fontSize: '13px', color: '#8a92a6', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem' }}>
        ← All Weapons
      </Link>

      <div style={{
        background: '#161920',
        border: `1px solid ${isExotic ? '#c89b3c30' : '#8a6bbf20'}`,
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'flex-start',
      }}>
        {weapon.screenshot ? (
          <img
            src={weapon.screenshot}
            alt={weapon.name}
            style={{ width: '200px', borderRadius: '8px', background: '#0a0c10', flexShrink: 0, objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : weapon.icon ? (
          <img
            src={weapon.icon}
            alt={weapon.name}
            width={80} height={80}
            style={{ borderRadius: '8px', background: '#0a0c10', flexShrink: 0 }}
          />
        ) : null}

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: isExotic ? '#c89b3c' : '#8a6bbf',
            }}>
              {isExotic ? 'Exotic' : 'Legendary'}
            </span>
            <span style={{ fontSize: '10px', color: '#4a5060' }}>·</span>
            <span style={{ fontSize: '10px', color: '#8a92a6' }}>{weapon.weaponTypeName}</span>
            <span style={{ fontSize: '10px', color: '#4a5060' }}>·</span>
            <span style={{ fontSize: '10px', color: '#8a92a6' }}>{weapon.ammoTypeName} Ammo</span>
            {weapon.damageTypeName && (
              <>
                <span style={{ fontSize: '10px', color: '#4a5060' }}>·</span>
                <span style={{ fontSize: '10px', color: weapon.damageTypeColor || '#8a92a6' }}>
                  {weapon.damageTypeName}
                </span>
              </>
            )}
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#e8eaf0', marginBottom: '8px' }}>
            {weapon.name}
          </h1>

          {weapon.flavorText && (
            <p style={{ fontSize: '13px', color: '#8a92a6', fontStyle: 'italic', marginBottom: '12px', lineHeight: '1.6' }}>
              "{weapon.flavorText}"
            </p>
          )}

          {weapon.motChange && weapon.motChange !== 'none' && (
            <div style={{
              background: '#0a0c10', border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: `3px solid ${changeInfo.color}`,
              borderRadius: '0 6px 6px 0', padding: '10px 14px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: changeInfo.color, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Monument of Triumph · {changeInfo.label}
              </div>
              {weapon.motSummary && (
                <div style={{ fontSize: '13px', color: '#8a92a6' }}>{weapon.motSummary}</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {weapon.motChanges?.length > 0 && (
          <div style={{
            background: '#161920', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', padding: '1.25rem',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#e8eaf0', marginBottom: '1rem' }}>
              📋 Monument of Triumph Changes
            </h2>
            {weapon.motChanges.map((c, i) => {
              const ct = CHANGE_COLORS[c.changeType] || CHANGE_COLORS.neutral
              return (
                <div key={i} style={{ position: 'relative', paddingLeft: '18px', marginBottom: '10px' }}>
                  <div style={{
                    position: 'absolute', left: 4, top: 5,
                    width: 8, height: 8, borderRadius: '50%', background: ct.color,
                  }} />
                  {i < weapon.motChanges.length - 1 && (
                    <div style={{
                      position: 'absolute', left: 7, top: 13,
                      width: 1, height: 'calc(100% + 2px)', background: 'rgba(255,255,255,0.05)',
                    }} />
                  )}
                  <div style={{ fontSize: '10px', color: '#4a5060', marginBottom: '2px' }}>
                    Jun 9, 2026 · {ct.label}
                  </div>
                  <div style={{ fontSize: '13px', color: '#8a92a6', lineHeight: '1.5' }}>
                    {c.desc}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {weapon.archetypeNotes && (
          <div style={{
            background: '#161920', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', padding: '1.25rem',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#e8eaf0', marginBottom: '1rem' }}>
              🗂 Archetype Changes ({weapon.weaponTypeName})
            </h2>
            <p style={{ fontSize: '13px', color: '#8a92a6', lineHeight: '1.6' }}>
              {weapon.archetypeNotes}
            </p>
          </div>
        )}
      </div>

      {weapon.patchHistory?.length > 0 && (
        <div style={{
          background: '#161920', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px', padding: '1.25rem', marginTop: '1rem',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#e8eaf0', marginBottom: '1rem' }}>
            📅 Patch History
          </h2>
          {weapon.patchHistory.map((entry, i) => {
            const src = SOURCE_STYLES[entry.source] || SOURCE_STYLES.twid
            return (
              <div key={i} style={{
                paddingBottom: '1rem', marginBottom: '1rem',
                borderBottom: i < weapon.patchHistory.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#c89b3c' }}>{entry.date}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px',
                    background: src.bg, color: src.color, border: `1px solid ${src.border}`,
                  }}>{src.label}</span>
                  {entry.patch && (
                    <span style={{ fontSize: '11px', color: '#4a5060' }}>{entry.patch}</span>
                  )}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8eaf0', marginBottom: '4px' }}>
                  {entry.title}
                </div>
                <div style={{ fontSize: '12px', color: '#8a92a6', lineHeight: '1.6' }}>
                  {entry.summary}
                </div>
                {entry.url && entry.url !== 'https://www.bungie.net' && (
                  <a href={entry.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '11px', color: '#4a9eff', display: 'block', marginTop: '6px' }}>
                    View on Bungie.net ↗
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}