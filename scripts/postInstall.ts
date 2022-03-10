//if test \"$NODE_ENV\" = \"production\" || test \"$NODE_ENV\" = \"staging\" ; then npm run build:front && npm run build:css && npm run build && npm run migrate; fi

import dotenv from 'dotenv'
import { spawnSync } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { getTrackerScript } from '../src/infra/umami'

process.env.NODE_ENV ?? dotenv.config()

const NODE_ENV = process.env.NODE_ENV || ''
const executeMigrateScript = process.env.DO_NOT_EXECUTE_MIGRATE ? false : true
const trackerWebsiteId = process.env.TRACKER_WEBSITE_ID

postInstall()

async function postInstall() {
  if (!['', 'local', 'test'].includes(NODE_ENV)) {
    const build = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' })
    if (build.status && build.status > 0) process.exit(build.status)

    await insertTracker()

    if (executeMigrateScript) {
      const migrate = spawnSync('npm', ['run', 'migrate'], { stdio: 'inherit' })
      process.exit(migrate.status ?? 0)
    }

    process.exit(0)
  }
}

async function insertTracker() {
  if (!trackerWebsiteId) return

  const trackerScript = getTrackerScript(trackerWebsiteId)
  const trackerRegexp = /<!-- TRACKER -->/g

  const indexPath = path.resolve('dist/src/public/index.html')
  const indexHtml = await fs.readFile(indexPath, { encoding: 'utf-8' })

  if (!indexHtml.match(trackerRegexp)) {
    console.warn(
      'WARNING ! TRACKER COULD NOT BE INJECTED, index.html does not contain <!-- TRACKER -->'
    )

    return
  }

  await fs.writeFile(indexPath, indexHtml.replace(trackerRegexp, trackerScript))
}
