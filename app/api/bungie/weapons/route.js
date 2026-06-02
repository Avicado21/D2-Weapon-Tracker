// app/api/bungie/weapons/route.js
// Returns filtered weapon list from the Bungie manifest
// Query params: type (subType int), rarity (4=legendary,5=exotic), ammo (1/2/3), search (string)

import { getWeaponDefinitions, SUBTYPE_NAMES, ammoLabel, tierLabel } from '@/lib/bungie'
import { MOT_EXOTIC_CHANGES, ARCHETYPE_CHANGES } from '@/lib/patchData'
import { NextResponse } from 'next/server'

export const revalidate = 3600 // Cache for 1 hour (manifest doesn't change often)

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQ = searchParams.get('search')?.toLowerCase() || ''
    const typeFilter = searchParams.get('type') || ''
    const rarityFilter = searchParams.get('rarity') || ''
    const ammoFilter = searchParams.get('ammo') || ''
    const changeFilter = searchParams.get('change') || ''
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const allWeapons = await getWeaponDefinitions()

    let weapons = Object.values(allWeapons).map(w => {
      const weaponTypeName = SUBTYPE_NAMES[w.itemSubType] || w.itemTypeDisplayName
      const motData = MOT_EXOTIC_CHANGES[w.name] || null
      const archetypeData = ARCHETYPE_CHANGES[weaponTypeName] || null

      return {
        ...w,
        weaponTypeName,
        tierTypeName: tierLabel(w.tierType),
        ammoTypeName: ammoLabel(w.ammoType),
        motChange: motData?.type || archetypeData?.change || 'none',
        motSummary: motData?.summary || archetypeData?.notes || null,
        hasCatalyst: motData?.catalyst || false,
        isExotic: w.tierType === 5,
        motChanges: motData?.changes || [],
      }
    })

    // Apply filters
    if (searchQ) {
      weapons = weapons.filter(w =>
        w.name.toLowerCase().includes(searchQ) ||
        w.weaponTypeName.toLowerCase().includes(searchQ) ||
        w.flavorText.toLowerCase().includes(searchQ)
      )
    }
    if (typeFilter) {
      weapons = weapons.filter(w => w.weaponTypeName === typeFilter)
    }
    if (rarityFilter) {
      const rarityInt = rarityFilter === 'Exotic' ? 5 : rarityFilter === 'Legendary' ? 4 : null
      if (rarityInt) weapons = weapons.filter(w => w.tierType === rarityInt)
    }
    if (ammoFilter) {
      const ammoInt = { Primary: 1, Special: 2, Heavy: 3 }[ammoFilter]
      if (ammoInt) weapons = weapons.filter(w => w.ammoType === ammoInt)
    }
    if (changeFilter) {
      if (changeFilter === 'catalyst') {
        weapons = weapons.filter(w => w.hasCatalyst)
      } else if (changeFilter !== 'none') {
        weapons = weapons.filter(w => w.motChange === changeFilter)
      }
    }

    // Sort: exotics first, then alphabetical
    weapons.sort((a, b) => {
      if (a.tierType !== b.tierType) return b.tierType - a.tierType
      return a.name.localeCompare(b.name)
    })

    const total = weapons.length
    const paginated = weapons.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      total,
      offset,
      limit,
      weapons: paginated,
    })
  } catch (err) {
    console.error('Weapons fetch error:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
