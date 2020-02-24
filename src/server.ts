import * as express from 'express'
const app = express()
const port: number = 3000
import Component from './component'
import * as ReactDOMServer from 'react-dom/server'

import buildFromTemplate from './views/buildFromTemplate'

app.use(express.static('src/public'))

const router = express.Router()

router.get('/ssr', async (req, res) => {
  const htmlOutput = ReactDOMServer.renderToString(Component('john'))
  res.status(201).send(buildFromTemplate(htmlOutput))
})

app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
