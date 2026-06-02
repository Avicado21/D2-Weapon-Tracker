'use client'
// app/patches/page.jsx — Full TWID/TWAB/patch notes feed

import { useState } from 'react'
import { PATCH_FEED } from '@/lib/patchData'

const SOURCE_STYLES = {
  twid: { bg: '#4a9eff18', color: '#4a9eff', border: '#4a9eff30', label: 'TWID' },
  patchnotes: { bg: '#c89b3c18', color: '#c89b3c', border: '#c89b3c30', label: 'Patch Notes' },
  devinsight: { bg: '#8a6bbf18', color: '#8a6bbf', border: '#8a6bbf30', label: 'Dev Insight' },
}

const CHANGE_COLORS = {
  buff: { bg: '#4caf7a18', color: '#4caf7a', border: '#4caf7a25' },
  nerf: { bg: '#e0525218', color: '#e05252', border: '#e0525225' },
  rework: { bg: '#4a9eff18', color: '#4a9eff', border: '#4a9eff25' },
  neutral: { bg: '#1d2028', color: '#4a5060', border: '#ffffff10' },
}

export default function PatchesPage() {
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')

  const filtered = PATCH_FEED.filter(entry => {
    const matchSearch = !search || (
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.summary.toLowerCase().includes(search.toLowerCase()) ||
      entry.weaponChanges.some(w => w.name.toLowerCase().includes(search.toLowerCase()))
    )
    const matchSource = !sourceFilter || entry.source === sourceFilter
    return matchSearch && matchSource
  })

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#e8eaf0', marginBottom: '4px' }}>
          Patch Feed
        </h1>
        <p style={{ fontSize: '13px', color: '#8a92a6' }}>
          TWID, TWAB, Dev Insights, and patch notes — weapon changes across D2's lifespan
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Search patch notes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: '#161920', border: '1px solid rgba(255,255,255,0.06)',
            color: '#e8eaf0', padding: '7px 12px', borderRadius: '6px',
            fontSize: '13px', outline: 'none', width: '220px',
          }}
        />
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} style={{
          background: '#161920', border: '1px solid rgba(255,255,255,0.06)',
          color: '#8a92a6', padding: '7px 10px', borderRadius: '6px', fontSize: '12px',
        }}>
          <option value="">All Sources</option>
          <option value="twid">TWID</option>
          <option value="patchnotes">Patch Notes</option>
          <option value="devinsight">Dev Insight</option>
        </select>
        <span style={{ fontSize: '12px', color: '#4a5060', display: 'flex', alignItems: 'center' }}>
          {filtered.length} entries
        </span>
      </div>

      {/* Feed */}
      <div>
        {filtered.map((entry, i) => {
          const src = SOURCE_STYLES[entry.source] || SOURCE_STYLES.twid
          return (
            <div key={i} style={{
              padding: '1.25rem 0',
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#c89b3c' }}>{entry.date}</span>
                <span style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '2px 8px', borderRadius: '4px',
                  background: src.bg, color: src.color, border: `1px solid ${src.border}`,
                }}>{src.label}</span>
                {entry.patch && (
                  <span style={{ fontSize: '11px', color: '#4a5060', fontFamily: 'monospace' }}>
                    v{entry.patch}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#e8eaf0', marginBottom: '8px' }}>
                {entry.title}
              </h2>

              {/* Weapon tags */}
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {entry.weaponChanges.map((wc, j) => {
                  const cc = CHANGE_COLORS[wc.type] || CHANGE_COLORS.neutral
                  return (
                    <span key={j} style={{
                      fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '4px',
                      background: cc.bg, color: cc.color, border: `1px solid ${cc.border}`,
                    }}>
                      {wc.name}
                    </span>
                  )
                })}
              </div>

              <p style={{ fontSize: '13px', color: '#8a92a6', lineHeight: '1.7', maxWidth: '720px' }}>
                {entry.summary}
              </p>

              {entry.url && entry.url !== 'https://www.bungie.net' && (
                <a href={entry.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '11px', color: '#4a9eff', display: 'block', marginTop: '8px' }}>
                  View original on Bungie.net ↗
                </a>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#4a5060' }}>
            No entries match your search
          </div>
        )}
      </div>
    </div>
  )
}
