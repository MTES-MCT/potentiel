const express = require('express')
const app = express()
const port: number = 3000

app.use(express.static('src/public'))

const router = express.Router()

router.get('/ssr', async (req, res) => {
  res.status(201).send('Hello world')
})

app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
