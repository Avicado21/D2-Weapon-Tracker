'use client'
// components/WeaponCard.jsx

import { useState } from 'react'
import Link from 'next/link'

const CHANGE_COLORS = {
  buff: { bg: '#4caf7a18', color: '#4caf7a', border: '#4caf7a30', label: '▲ Buff' },
  nerf: { bg: '#e0525218', color: '#e05252', border: '#e0525230', label: '▼ Nerf' },
  rework: { bg: '#4a9eff18', color: '#4a9eff', border: '#4a9eff30', label: '↺ Rework' },
  catalyst: { bg: '#c89b3c18', color: '#c89b3c', border: '#c89b3c30', label: '⚗ Catalyst' },
  none: { bg: '#1d202818', color: '#4a5060', border: '#ffffff10', label: '— No change' },
}

const TYPE_ICONS = {
  'Auto Rifle': '🔄', 'Hand Cannon': '🔫', 'Scout Rifle': '🎯',
  'Pulse Rifle': '🔃', 'Submachine Gun': '⚡', 'Sidearm': '🔹',
  'Shotgun': '💥', 'Fusion Rifle': '⚡', 'Trace Rifle': '🔦',
  'Sniper Rifle': '🎯', 'Grenade Launcher': '💣', 'Rocket Launcher': '🚀',
  'Linear Fusion Rifle': '⚡', 'Machine Gun': '🔥', 'Sword': '⚔️',
  'Glaive': '🔱', 'Bow': '🏹',
}

export default function WeaponCard({ weapon }) {
  const [open, setOpen] = useState(false)
  const isExotic = weapon.tierType === 5 || weapon.isExotic
  const changeInfo = CHANGE_COLORS[weapon.motChange] || CHANGE_COLORS.none
  const icon = TYPE_ICONS[weapon.weaponTypeName] || '🔫'

  return (
    <div style={{
      background: '#161920',
      border: `1px solid ${isExotic ? '#c89b3c30' : '#ffffff08'}`,
      borderLeft: `3px solid ${isExotic ? '#c89b3c' : '#8a6bbf'}`,
      borderRadius: '8px',
      padding: '12px',
      transition: 'border-color .15s, background .15s',
      cursor: 'default',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
        {weapon.icon ? (
          <img
            src={weapon.icon}
            alt={weapon.name}
            width={40} height={40}
            style={{ borderRadius: '6px', background: '#0a0c10', flexShrink: 0 }}
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div style={{
            width: 40, height: 40, borderRadius: '6px', flexShrink: 0,
            background: isExotic ? '#c89b3c22' : '#8a6bbf22',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>{icon}</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
            <Link href={`/weapons/${weapon.hash}`} style={{
              fontWeight: 600, fontSize: '14px', color: '#e8eaf0', lineHeight: '1.3',
            }}>
              {weapon.name}
            </Link>
          </div>
          <div style={{ fontSize: '11px', color: '#8a92a6', marginTop: '2px' }}>
            {weapon.weaponTypeName || weapon.itemTypeDisplayName}
          </div>
          <div style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginTop: '2px',
            color: isExotic ? '#c89b3c' : '#8a6bbf',
          }}>
            {isExotic ? 'Exotic' : 'Legendary'}
          </div>
        </div>
      </div>

      {/* Change badges */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
        {weapon.motChange && weapon.motChange !== 'none' && (
          <span style={{
            background: changeInfo.bg, color: changeInfo.color,
            border: `1px solid ${changeInfo.border}`,
            fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px',
          }}>{changeInfo.label}</span>
        )}
        {weapon.hasCatalyst && (
          <span style={{
            background: '#c89b3c18', color: '#c89b3c', border: '1px solid #c89b3c30',
            fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px',
          }}>⚗ New Catalyst</span>
        )}
      </div>

      {/* Summary */}
      {weapon.motSummary && (
        <div style={{ fontSize: '12px', color: '#8a92a6', marginBottom: '8px', lineHeight: '1.5' }}>
          {weapon.motSummary}
        </div>
      )}

      {/* Ammo + slot info */}
      <div style={{ fontSize: '11px', color: '#4a5060', marginBottom: '8px' }}>
        📦 {weapon.ammoTypeName || '—'} · {weapon.slot || '—'} Slot
      </div>

      {/* Expand toggle */}
      {weapon.motChanges?.length > 0 && (
        <>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              background: 'none', border: 'none', padding: 0,
              fontSize: '11px', color: '#4a9eff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            {open ? '▲ Hide' : '▼ Show'} MoT changes ({weapon.motChanges.length})
          </button>

          {open && (
            <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
              {weapon.motChanges.map((c, i) => {
                const ct = CHANGE_COLORS[c.changeType] || CHANGE_COLORS.none
                return (
                  <div key={i} style={{
                    position: 'relative', paddingLeft: '16px', marginBottom: '8px',
                  }}>
                    <span style={{
                      position: 'absolute', left: 0, top: '4px',
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: ct.color, display: 'block',
                    }} />
                    <div style={{ fontSize: '11px', color: '#4a5060', marginBottom: '2px' }}>
                      Jun 9, 2026 · Monument of Triumph
                    </div>
                    <div style={{ fontSize: '12px', color: '#8a92a6', lineHeight: '1.5' }}>
                      {c.desc}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
