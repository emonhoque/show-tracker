#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Badge Backfill Script
// ---------------------------------------------------------------------------
// Usage:
//   node scripts/backfill-badges.mjs
//
// Calls the POST /api/badges/backfill endpoint using the CRON_SECRET
// from the .env file. Requires the Next.js dev server to be running.
// ---------------------------------------------------------------------------

import { config } from 'dotenv'
config({ path: '.env.local' })

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const CRON_SECRET = process.env.CRON_SECRET

if (!CRON_SECRET) {
  console.error('Error: CRON_SECRET is not set in .env.local')
  process.exit(1)
}

async function main() {
  console.log(`\nBackfilling badges via ${BASE_URL}/api/badges/backfill ...\n`)

  const res = await fetch(`${BASE_URL}/api/badges/backfill`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
    },
  })

  if (!res.ok) {
    console.error(`Request failed with status ${res.status}:`, await res.text())
    process.exit(1)
  }

  const result = await res.json()

  console.log(`Processed ${result.processed} user(s).`)
  console.log(`Total new badges unlocked: ${result.totalNewBadges}`)

  if (result.details && result.details.length > 0) {
    console.log('\nDetails:')
    for (const d of result.details) {
      console.log(`  ${d.user}: ${d.newBadges.join(', ')}`)
    }
  } else {
    console.log('No new badges to unlock.')
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error('Backfill failed:', err)
  process.exit(1)
})
