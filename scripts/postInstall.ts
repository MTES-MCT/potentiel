//if test \"$NODE_ENV\" = \"production\" || test \"$NODE_ENV\" = \"staging\" ; then npm run build:front && npm run build:css && npm run build && npm run migrate; fi

import dotenv from 'dotenv'
import { spawnSync } from 'child_process'

process.env.NODE_ENV ?? dotenv.config()

const NODE_ENV = process.env.NODE_ENV || ''

if (!['local', 'test'].includes(NODE_ENV)) {
  spawnSync('npm', ['run', 'build'], { stdio: 'inherit' })
  spawnSync('npm', ['run', 'migrate'], { stdio: 'inherit' })
}
