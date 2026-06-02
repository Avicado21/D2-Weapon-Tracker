// app/api/bungie/manifest/route.js
// Proxies the Bungie manifest endpoint — solves CORS for client-side fetches

import { getManifest } from '@/lib/bungie'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const manifest = await getManifest()
    return NextResponse.json({ success: true, manifest })
  } catch (err) {
    console.error('Manifest fetch error:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
