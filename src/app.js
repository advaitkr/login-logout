const express = require('express')
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const db = require('./db/connect')(app)
const port = process.env.port
const userRouter = require('./routes/user')

app.use(userRouter)
app.listen(port, () => {
    console.log('server listening on port ' + port)
})