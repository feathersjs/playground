import express from 'express'

const port = 3031
const app = express()

app.get('/todos/:id', (req, res) => {
  res.json({
    id: `express-${req.params.id}`,
    message: `You have to do ${req.params.id}`
  })
})

app.listen(port, () => console.log(`Express REST API started at http://localhost:${port}`))
