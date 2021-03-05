const express = require("express")
const app = express()
const index = require('./router/index')

const dotenv = require("dotenv")
dotenv.config()

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.HTTP_PORT, () => {
    console.log("Server running on port number : %PORT%".replace("%PORT%", process.env.HTTP_PORT))
})

app.use('/', index)