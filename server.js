const express = require("express")
const app = express()
const cors = require("cors")
const bp = require("body-parser")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const axios = require("axios")
const HTTPStatus = require('./HTTPStatus.js')
// const dbHandlers = require("./database/handlers")
const { Account } = require("./database/index")
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const PORT = process.env.PORT || 3000
const saltRounds = 10
const corsOptions = {
  credentials: true,
  origin: process.env.NODE_ENV === "development" ? "http://localhost:3010" : "https://www.tastepeak.com"
}
app.use(cookieParser())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors(corsOptions))

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

const zomatoConfig = {
  headers: {
    "user-key": process.env.zomato_user_key
  }
};

const accessTokenSecret = process.env.access_token_secret;

app.get("/", (req, res) => {
  res.send(`<h2>Welcome to Taste Peak Server!</h2>`)
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

  let loc = req.params.loc;
  let start = req.query.start;
  let keyword = req.query.kw;

  try {
    // get location data
    const locations = await axios.get(`https://developers.zomato.com/api/v2.1/locations?query=${loc}`, zomatoConfig)
    const location = locations.data.location_suggestions[0]
    
    // get restaurant data with location 
    const { data } = await axios.get(`https://developers.zomato.com/api/v2.1/search?entity_id=${location.entity_id}&entity_type=${location.entity_type}&start=${start}&q=${keyword}`, zomatoConfig)
    const restaurants = data.restaurants
    const total = data.results_found
    start = data.results_start
    res.send({ location, total, start, restaurants })
  } catch (error) {
    res.sendStatus(HTTPStatus.BAD_REQUEST)
  }
})

app.listen(PORT, () => console.log(`server is listening on port ${PORT}...`))