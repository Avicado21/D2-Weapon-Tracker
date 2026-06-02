// app/api/bungie/item/[hash]/route.js
// Returns a single weapon by its Bungie item hash with all MoT patch data attached

import { getWeaponByHash, SUBTYPE_NAMES, ammoLabel, tierLabel, DAMAGE_TYPES } from '@/lib/bungie'
import { MOT_EXOTIC_CHANGES, ARCHETYPE_CHANGES, PATCH_FEED } from '@/lib/patchData'
import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET(request, { params }) {
  try {
    const hash = params.hash
    const weapon = await getWeaponByHash(hash)

    if (!weapon) {
      return NextResponse.json(
        { success: false, error: `No weapon found for hash ${hash}` },
        { status: 404 }
      )
    }

    const weaponTypeName = SUBTYPE_NAMES[weapon.itemSubType] || weapon.itemTypeDisplayName
    const motData = MOT_EXOTIC_CHANGES[weapon.name] || null
    const archetypeData = ARCHETYPE_CHANGES[weaponTypeName] || null

    // Find all patch feed entries that mention this weapon
    const relatedPatches = PATCH_FEED.filter(entry =>
      entry.weaponChanges.some(wc =>
        wc.name.toLowerCase() === weapon.name.toLowerCase() ||
        wc.name.toLowerCase().includes(weaponTypeName.toLowerCase())
      )
    )

    const damageInfo = DAMAGE_TYPES[weapon.defaultDamageType] || DAMAGE_TYPES[0]

    return NextResponse.json({
      success: true,
      weapon: {
        ...weapon,
        weaponTypeName,
        tierTypeName: tierLabel(weapon.tierType),
        ammoTypeName: ammoLabel(weapon.ammoType),
        damageTypeName: damageInfo.name,
        damageTypeColor: damageInfo.color,
        isExotic: weapon.tierType === 5,
        motChange: motData?.type || archetypeData?.change || 'none',
        motSummary: motData?.summary || archetypeData?.notes || null,
        motChanges: motData?.changes || [],
        hasCatalyst: motData?.catalyst || false,
        archetypeNotes: archetypeData?.notes || null,
        patchHistory: relatedPatches,
      },
    })
  } catch (err) {
    console.error('Item fetch error:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
