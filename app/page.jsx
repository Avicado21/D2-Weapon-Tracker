'use client'
// app/page.jsx — Main weapons browser

import { useState, useEffect, useCallback } from 'react'
import WeaponCard from '@/components/WeaponCard'
import { ARCHETYPE_CHANGES } from '@/lib/patchData'

const WEAPON_TYPES = [
  'Auto Rifle','Hand Cannon','Scout Rifle','Pulse Rifle','Submachine Gun',
  'Sidearm','Shotgun','Fusion Rifle','Trace Rifle','Sniper Rifle',
  'Grenade Launcher','Rocket Launcher','Linear Fusion Rifle',
  'Machine Gun','Sword','Glaive','Bow',
]

const ARCHETYPE_ICONS = {
  'Auto Rifle':'🔄','Hand Cannon':'🔫','Scout Rifle':'🎯','Pulse Rifle':'🔃',
  'Submachine Gun':'⚡','Sidearm':'🔹','Shotgun':'💥','Fusion Rifle':'⚡',
  'Trace Rifle':'🔦','Sniper Rifle':'🎯','Grenade Launcher':'💣','Rocket Launcher':'🚀',
  'Linear Fusion Rifle':'⚡','Machine Gun':'🔥','Sword':'⚔️','Glaive':'🔱','Bow':'🏹',
}

const BROWSE_MODES = ['Search & Filter', 'By Archetype', 'By Slot']

export default function WeaponsPage() {
  const [browse, setBrowse] = useState(0)
  const [weapons, setWeapons] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState('')
  const [changeFilter, setChangeFilter] = useState('')
  const [ammoFilter, setAmmoFilter] = useState('')

  const fetchWeapons = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (typeFilter) params.set('type', typeFilter)
      if (rarityFilter) params.set('rarity', rarityFilter)
      if (changeFilter) params.set('change', changeFilter)
      if (ammoFilter) params.set('ammo', ammoFilter)
      params.set('limit', '200')

      const res = await fetch(`/api/bungie/weapons?${params}`)
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setWeapons(data.weapons)
      setTotal(data.total)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter, rarityFilter, changeFilter, ammoFilter])

  useEffect(() => {
    const t = setTimeout(fetchWeapons, 300)
    return () => clearTimeout(t)
  }, [fetchWeapons])

  const weaponsBySlot = {
    Kinetic: weapons.filter(w => w.ammoType === 1),
    Special: weapons.filter(w => w.ammoType === 2),
    Heavy: weapons.filter(w => w.ammoType === 3),
  }

  const weaponsByType = {}
  weapons.forEach(w => {
    const t = w.weaponTypeName || 'Unknown'
    if (!weaponsByType[t]) weaponsByType[t] = []
    weaponsByType[t].push(w)
  })

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#e8eaf0', marginBottom: '4px' }}>
          Destiny 2 Weapons
        </h1>
        <p style={{ fontSize: '13px', color: '#8a92a6' }}>
          Full weapon list · Monument of Triumph final sandbox state · June 9, 2026
        </p>
      </div>

      {/* Browse mode tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
        {BROWSE_MODES.map((mode, i) => (
          <button key={mode} onClick={() => setBrowse(i)} style={{
            padding: '5px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
            background: browse === i ? '#1d2028' : 'transparent',
            color: browse === i ? '#c89b3c' : '#8a92a6',
            border: `1px solid ${browse === i ? '#c89b3c40' : 'rgba(255,255,255,0.06)'}`,
            transition: 'all .15s',
          }}>{mode}</button>
        ))}
      </div>

      {/* Filters (show for search mode) */}
      {browse === 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search weapons…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: '#161920', border: '1px solid rgba(255,255,255,0.06)',
              color: '#e8eaf0', padding: '7px 12px', borderRadius: '6px',
              fontSize: '13px', outline: 'none', width: '200px',
            }}
          />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{
            background: '#161920', border: '1px solid rgba(255,255,255,0.06)',
            color: '#8a92a6', padding: '7px 10px', borderRadius: '6px', fontSize: '12px',
          }}>
            <option value="">All Types</option>
            {WEAPON_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={rarityFilter} onChange={e => setRarityFilter(e.target.value)} style={{
            background: '#161920', border: '1px solid rgba(255,255,255,0.06)',
            color: '#8a92a6', padding: '7px 10px', borderRadius: '6px', fontSize: '12px',
          }}>
            <option value="">All Rarities</option>
            <option>Exotic</option>
            <option>Legendary</option>
          </select>
          <select value={ammoFilter} onChange={e => setAmmoFilter(e.target.value)} style={{
            background: '#161920', border: '1px solid rgba(255,255,255,0.06)',
            color: '#8a92a6', padding: '7px 10px', borderRadius: '6px', fontSize: '12px',
          }}>
            <option value="">All Slots</option>
            <option>Primary</option>
            <option>Special</option>
            <option>Heavy</option>
          </select>
          <select value={changeFilter} onChange={e => setChangeFilter(e.target.value)} style={{
            background: '#161920', border: '1px solid rgba(255,255,255,0.06)',
            color: '#8a92a6', padding: '7px 10px', borderRadius: '6px', fontSize: '12px',
          }}>
            <option value="">All MoT Changes</option>
            <option value="buff">Buffed</option>
            <option value="nerf">Nerfed</option>
            <option value="rework">Reworked</option>
            <option value="catalyst">New Catalyst</option>
          </select>
        </div>
      )}

      {/* Status bar */}
      {browse === 0 && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {loading ? (
            <span style={{ fontSize: '12px', color: '#4a9eff' }}>⏳ Loading from Bungie API…</span>
          ) : error ? (
            <span style={{ fontSize: '12px', color: '#e05252' }}>⚠️ {error} — check your API key in .env.local</span>
          ) : (
            <>
              {[
                { label: `${total} weapons`, color: '#e8eaf0' },
                { label: `${weapons.filter(w => w.motChange === 'buff').length} buffed`, color: '#4caf7a' },
                { label: `${weapons.filter(w => w.motChange === 'nerf').length} nerfed`, color: '#e05252' },
                { label: `${weapons.filter(w => w.motChange === 'rework').length} reworked`, color: '#4a9eff' },
              ].map(({ label, color }) => (
                <span key={label} style={{
                  fontSize: '12px', color, background: '#161920',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '4px 10px', borderRadius: '5px',
                }}>{label}</span>
              ))}
            </>
          )}
        </div>
      )}

      {/* Search grid view */}
      {browse === 0 && !loading && !error && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '10px',
        }}>
          {weapons.map(w => <WeaponCard key={w.hash} weapon={w} />)}
          {weapons.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#4a5060' }}>
              No weapons match your filters
            </div>
          )}
        </div>
      )}

      {/* Archetype view */}
      {browse === 1 && (
        <div>
          {WEAPON_TYPES.map(type => {
            const arcData = ARCHETYPE_CHANGES[type]
            const changeColor = arcData?.change === 'buff' ? '#4caf7a' : arcData?.change === 'nerf' ? '#e05252' : '#4a5060'
            const changeLabel = arcData?.change === 'buff' ? '▲ Buffed' : arcData?.change === 'nerf' ? '▼ Nerfed' : '— No change'
            return (
              <div key={type} style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  marginBottom: '10px', paddingBottom: '8px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ fontSize: '16px' }}>{ARCHETYPE_ICONS[type] || '🔫'}</span>
                  <span style={{ fontWeight: 600, fontSize: '15px', color: '#e8eaf0' }}>{type}</span>
                  <span style={{ fontSize: '11px', color: changeColor, fontWeight: 600 }}>{changeLabel}</span>
                  {arcData?.notes && (
                    <span style={{ fontSize: '12px', color: '#8a92a6', marginLeft: '4px' }}>— {arcData.notes}</span>
                  )}
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px',
                }}>
                  {(weaponsByType[type] || []).slice(0, 12).map(w => (
                    <WeaponCard key={w.hash} weapon={w} />
                  ))}
                  {!weaponsByType[type] && !loading && (
                    <div style={{ fontSize: '12px', color: '#4a5060', padding: '8px 0' }}>
                      Loading… (fetch weapons first via search tab)
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Slot view */}
      {browse === 2 && (
        <div>
          {Object.entries(weaponsBySlot).map(([slot, slotWeapons]) => (
            <div key={slot} style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                marginBottom: '10px', paddingBottom: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ fontWeight: 600, fontSize: '16px', color: '#c89b3c' }}>
                  {slot === 'Primary' ? '🔵' : slot === 'Special' ? '🟢' : '🔴'} {slot} Slot
                </span>
                <span style={{ fontSize: '12px', color: '#4a5060' }}>
                  {slotWeapons.length} weapons
                </span>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px',
              }}>
                {slotWeapons.map(w => <WeaponCard key={w.hash} weapon={w} />)}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#4a9eff', fontSize: '13px' }}>
              ⏳ Loading from Bungie API…
            </div>
          )}
        </div>
      )}
    </div>
  )
}
