import * as express from 'express'
const app = express()
const port: number = 3000

import makeExpressCallback from './helpers/makeExpressCallback'
import { getAdminLoginPage } from './controllers'

app.use(express.static('src/public'))

const router = express.Router()

router.get('/dgec/login.html', makeExpressCallback(getAdminLoginPage))

app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
