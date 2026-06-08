// lib/bungie.js
// Core Bungie API client — handles manifest fetching, caching, and weapon parsing

const BUNGIE_ROOT = 'https://www.bungie.net'
const API_KEY = process.env.BUNGIE_API_KEY

// In-memory cache for the manifest URLs (resets on server restart)
// For production, swap this with Redis or a DB
let manifestCache = null
let weaponDefCache = null

export function bungieHeaders() {
  return {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  }
}

/**
 * Fetch the Bungie manifest metadata.
 * Returns the manifest object including paths to JSON content databases.
 */
export async function getManifest() {
  if (manifestCache) return manifestCache

  const res = await fetch(`${BUNGIE_ROOT}/Platform/Destiny2/Manifest/`, {
    headers: bungieHeaders(),
  })

  if (!res.ok) {
    throw new Error(`Bungie manifest fetch failed: ${res.status}`)
  }

  const data = await res.json()
  manifestCache = data.Response
  return manifestCache
}

/**
 * Fetch all DestinyInventoryItemDefinitions (weapons, armor, mods, etc.)
 * and filter down to actual weapons using itemType === 3.
 *
 * itemType values:
 *   0 = None, 1 = Currency, 2 = Armor, 3 = Weapon, 19 = Mod, 20 = Dummy...
 *
 * itemSubType values for weapons:
 *   6=Auto Rifle, 7=Shotgun, 8=Machine Gun, 9=Hand Cannon, 10=Rocket Launcher,
 *   11=Fusion Rifle, 12=Sniper Rifle, 13=Pulse Rifle, 14=Scout Rifle,
 *   17=Sidearm, 18=Sword, 22=Linear Fusion Rifle, 23=Grenade Launcher (special),
 *   24=Submachine Gun, 25=Trace Rifle, 26=Helmet, 31=Bow, 33=Glaive
 */
export async function getWeaponDefinitions() {
  if (weaponDefCache) return weaponDefCache

  const manifest = await getManifest()
  const itemDefPath = manifest.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition

  const res = await fetch(`${BUNGIE_ROOT}${itemDefPath}`, {
    headers: bungieHeaders(),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch item definitions: ${res.status}`)
  }

  const allItems = await res.json()

  // Filter to weapons only (itemType 3), exclude deprecated/dummy items
  const weapons = {}
  for (const [hash, item] of Object.entries(allItems)) {
    if (
      item.itemType === 3 &&
      item.displayProperties?.name &&
      item.displayProperties.name.trim() !== '' &&
      !item.redacted &&
      Number(item.inventory?.tierType) >= 5 // 4=Legendary, 5=Exotic (skip common/uncommon/rare)
    ) {
      weapons[hash] = {
        hash: parseInt(hash),
        name: item.displayProperties.name,
        description: item.displayProperties.description,
        icon: item.displayProperties.icon
          ? `${BUNGIE_ROOT}${item.displayProperties.icon}`
          : null,
        screenshot: item.screenshot
          ? `${BUNGIE_ROOT}${item.screenshot}`
          : null,
        itemSubType: item.itemSubType,
        tierType: Number(item.inventory?.tierType),
        tierTypeName: item.inventory?.tierTypeName,
        damageTypes: item.damageTypeHashes || [],
        defaultDamageType: item.defaultDamageType,
        stats: item.stats?.stats || {},
        perks: item.sockets?.socketEntries || [],
        flavorText: item.flavorText || '',
        itemTypeDisplayName: item.itemTypeDisplayName || '',
        ammoType: item.equippingBlock?.ammoType, // 1=Primary, 2=Special, 3=Heavy
        bucketTypeHash: item.inventory?.bucketTypeHash,
        classType: item.classType, // 0=Titan,1=Hunter,2=Warlock,3=Any
        crafting: item.crafting || null,
      }
    }
  }

  weaponDefCache = weapons
  return weapons
}

/**
 * Get a single weapon by hash
 */
export async function getWeaponByHash(hash) {
  const weapons = await getWeaponDefinitions()
  return weapons[hash] || null
}

/**
 * Map ammoType integer to label
 */
export function ammoLabel(ammoType) {
  return { 1: 'Primary', 2: 'Special', 3: 'Heavy' }[ammoType] || 'Unknown'
}

/**
 * Map tierType integer to label
 */
export function tierLabel(tierType) {
  return { 4: 'Legendary', 5: 'Exotic' }[tierType] || 'Unknown'
}

/**
 * Map itemSubType to a readable weapon type
 */
export const SUBTYPE_NAMES = {
  6: 'Auto Rifle',
  7: 'Shotgun',
  8: 'Machine Gun',
  9: 'Hand Cannon',
  10: 'Rocket Launcher',
  11: 'Fusion Rifle',
  12: 'Sniper Rifle',
  13: 'Pulse Rifle',
  14: 'Scout Rifle',
  17: 'Sidearm',
  18: 'Sword',
  22: 'Linear Fusion Rifle',
  23: 'Grenade Launcher',
  24: 'Submachine Gun',
  25: 'Trace Rifle',
  31: 'Bow',
  33: 'Glaive',
}

/**
 * Map damageType integer to label + color
 */
export const DAMAGE_TYPES = {
  0: { name: 'None', color: '#888' },
  1: { name: 'Kinetic', color: '#c8c8c8' },
  2: { name: 'Arc', color: '#79c7e3' },
  3: { name: 'Solar', color: '#f5a623' },
  4: { name: 'Void', color: '#b185df' },
  6: { name: 'Stasis', color: '#4d86b3' },
  7: { name: 'Strand', color: '#4caf7a' },
}
