const express = require("express")
const app = express()
const bp = require("body-parser")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const axios = require("axios")
const HTTPStatus = require('./HTTPStatus.js')
const path = require('path')
const APPDIR = path.resolve()
const { Account } = require("./database/index")
const cors = require("cors")
const res = require('express/lib/response.js')
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const corsOptions = {
  credentials: true,
  origin: "https://www.tastepeak.com"
}
const PORT = process.env.PORT || 3000
const saltRounds = 10
app.use(cookieParser())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors(corsOptions))

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

const accessTokenSecret = process.env.access_token_secret;

app.get("/hello", (req, res) => {
  res.json({ hello: 'world' })
})

//create new account
app.post("/api/signup", async (req, res) => {

  try {
    // check if the username already exists
    const user = await Account.findOne({ username: req.body.username })
    if (user) return res.status(HTTPStatus.BAD_REQUEST).send({ message: "Username already exists" })

    //hash password
    const password = await bcrypt.hash(req.body.password, saltRounds)
    let newUser = await Account.create({ ...req.body, password })

    //create an access token
    const accessToken = jwt.sign({ username: req.body.username, email: req.body.email }, accessTokenSecret)

    //create a token cookie that expires atfer 3 days
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000, sameSite: "None", secure: true })

    // send back new user data except password
    res.send({ data: { username: newUser.username, email: newUser.email } })
  } catch (error) {
    res.status(HTTPStatus.BAD_REQUEST).send({ message: 'Unable to signup at the moment, try again later.' })
  }
})

//handle log in
app.post("/api/login", async (req, res) => {
  try {
    const user = await Account.findOne({ username: req.body.username })

    //username doesn't exist
    if (!user) return res.status(HTTPStatus.NOT_FOUND).send({ message: "Username does not exist" })
    const match = await bcrypt.compare(req.body.password, user.password)

    //Invalid Password
    if (!match) return res.status(HTTPStatus.UNAUTHORIZED).send({ message: "Invalid Password" })

    //Valid username and password combination
    //generate an access token
    const accessToken = jwt.sign({ username: user.username, email: user.email }, accessTokenSecret);

    //create a token cookie that expires after 3 days, sameSite: "None", secure: true
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000, sameSite: "None", secure: true })
    res.send({ data: { username: user.username, email: user.email } })

  } catch (error) {
    res.status(HTTPStatus.BAD_REQUEST).send({ message: "Unable to login at the moment, try again later." })
  }
})

//get current user info
app.get("/api/current-user", (req, res) => {
  console.log('accessToken:', req.cookies.accessToken)
  //access token does not exist
  if (req.cookies.accessToken === undefined) { return res.send(null) }

  //verify access token
  jwt.verify(req.cookies.accessToken, accessTokenSecret, function (err, decoded) {
    if (err) { return res.sendStatus(HTTPStatus.FORBIDDEN) }
    res.send({ username: decoded.username, email: decoded.email })
  })
})

//handle log out
app.get("/api/logout", (req, res) => {
  res.clearCookie("accessToken", { httpOnly: true, sameSite: "None", secure: true })
  res.send({ status: "success" })
})


//get restaurants data from public API
app.get("/api/restaurants/:loc", async (req, res) => {
  const loc = req.params.loc
  const keyword = req.query.kw
  try {
    // get location data
    const result = await axios.get(`https://geocode.maps.co/search?q=${loc}`)
    const location = result.data[0]

    if (!location) return res.status(HTTPStatus.BAD_REQUEST).json({ message: "Can't find this location." })
    // get restaurant data with location 
    const { data: { restaurants } } = keyword ? await axios.get(`https://api.spoonacular.com/food/restaurants/search?apiKey=${process.env.SPOONACULAR_API_KEY}&lat=${location.lat}&lng=${location.lon}&cuisine=${keyword}`) : await axios.get(`https://api.spoonacular.com/food/restaurants/search?apiKey=${process.env.SPOONACULAR_API_KEY}&lat=${location.lat}&lng=${location.lon}`)
    const filtered = restaurants.filter((r) => r.address.city.toLowerCase() === loc.toLowerCase())
    res.json(filtered)
  } catch (error) {
    console.log('error:', error)
    res.status(HTTPStatus.BAD_REQUEST).json({ message: 'Having issue finding restaurants.' })
  }
})

if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(APPDIR, 'client/dist')))
  app.get('*', (req, res) => res.sendFile(path.join(APPDIR, 'client/dist/index.html')))
} else {
  app.get('/', (req, res) => res.status(200).send('taste peak api'))
}

app.listen(PORT, () => console.log(`server is listening on port ${PORT}...`))