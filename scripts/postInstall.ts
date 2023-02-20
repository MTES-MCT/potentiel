import fs from 'fs'
import dotenv from 'dotenv'
import { spawnSync } from 'child_process'

process.env.NODE_ENV ?? dotenv.config()

const NODE_ENV = process.env.NODE_ENV || ''
const executeMigrateScript = process.env.DO_NOT_EXECUTE_MIGRATE ? false : true

postInstall()

async function postInstall() {
  if (['', 'local'].includes(NODE_ENV)) {
    spawnSync('npm', ['run', 'configure-dev-env-variables'], { stdio: 'inherit' })

    fs.rmSync('.husky/pre-commit', { force: true })
    spawnSync('npm', ['run', 'configure-pre-commit'], { stdio: 'inherit' })

    spawnSync('npm', ['run', 'configure-prepare-commit-msg'], { stdio: 'inherit' })
  }

  if (!['', 'local', 'test'].includes(NODE_ENV)) {
    const build = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' })
    if (build.status && build.status > 0) process.exit(build.status)

    if (executeMigrateScript) {
      const migrate = spawnSync('npm', ['run', 'migrate'], { stdio: 'inherit' })
      process.exit(migrate.status ?? 0)
    }
  }
  process.exit(0)
}
