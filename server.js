const express = require("express")
const app = express()
const index = require('./router/index')

//body-parser will try to parse the body content (encoded URL or JSON) of POST req
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
    console.log("Server running on port number : %PORT%".replace("%PORT%", HTTP_PORT))
})

app.use('/', index)