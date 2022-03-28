//if test \"$NODE_ENV\" = \"production\" || test \"$NODE_ENV\" = \"staging\" ; then npm run build:front && npm run build:css && npm run build && npm run migrate; fi

import dotenv from 'dotenv'
import { spawnSync } from 'child_process'

process.env.NODE_ENV ?? dotenv.config()

const NODE_ENV = process.env.NODE_ENV || ''
const executeMigrateScript = process.env.DO_NOT_EXECUTE_MIGRATE ? false : true

postInstall()

async function postInstall() {
  if (!['', 'local', 'test'].includes(NODE_ENV)) {
    const build = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' })
    if (build.status && build.status > 0) process.exit(build.status)

    if (executeMigrateScript) {
      const migrate = spawnSync('npm', ['run', 'migrate'], { stdio: 'inherit' })
      process.exit(migrate.status ?? 0)
    }

    process.exit(0)
  }
}
