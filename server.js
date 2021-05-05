const express = require("express")
const app = express()
const cors = require("cors")
const bp = require("body-parser")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const axios = require("axios")
const dbHandlers = require("./database/handlers")
if (process.env.NODE_ENV === 'development') {
	require('dotenv').config();
}
const PORT = process.env.PORT || 3000
const saltRounds = 10

app.use(cookieParser())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors())
// app.use(express.static("./client/dist"))

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

const zomatoConfig = {
	headers: {
		"user-key": process.env.zomato_user_key
	}
};

const accessTokenSecret = process.env.access_token_secret;

app.get("/hello", (req, res) => {
	res.send(`<h1>HELLO FROM SERVER</h1>`)
})

//create new account
app.post("/api/accounts", async (req, res) => {
	// console.log('plain text password:', req.body.password)
	const password = await bcrypt.hash(req.body.password, saltRounds)
	// console.log('hashed password:', password)
	dbHandlers.newAccount({ ...req.body, password }, (err, result) => {
		if (err) { return res.send({ status: "failure", error: err }) }
		let accessToken = jwt.sign({ username: req.body.username, email: req.body.email }, accessTokenSecret)
		res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
		res.send({ status: "success", data: result })
	})
})

//find an account
app.get("/api/accounts/:username", (req, res) => {
	dbHandlers.findAccount({ username: req.params.username }, (err, result) => {
		if (err) { return res.send(err) }
		res.send(result)
	})
})

//handle log in
app.post("/api/login", (req, res) => {
	dbHandlers.findAccount({ username: req.body.username }, async (err, result) => {
		if (err) { return res.send(err) }
		if (result === null) {
			res.send({ status: "failure", message: "Username does not exist" })
		} else {
			const match = await bcrypt.compare(req.body.password, result.password)
			if (match) {
				//generate an access token
				let accessToken = jwt.sign({ username: result.username, email: result.email }, accessTokenSecret);
				//create a token cookie that expires atfer 3 days
				res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
				res.send({ status: "success", data: { username: result.username, email: result.email } })
			} else {
				res.send({ status: "failure", message: "Invalid Password" })
			}
		}
	})
})

//get current user info
app.get("/api/current-user", (req, res) => {
	console.log('All cookies:', req.cookies)
	console.log('accessToken:', req.cookies.accessToken)
	//access token does not exist
	if (req.cookies.accessToken === undefined) { return res.send({}) }

	//verify access token
	jwt.verify(req.cookies.accessToken, accessTokenSecret, function (err, decoded) {
		if (err) { return res.sendStatus(403) }
		res.send({ username: decoded.username, email: decoded.email })
	})
})

//handle log out
app.get("/api/logout", (req, res) => {
	res.clearCookie("accessToken")
	res.send({ status: "success" })
})


//get restaurants data from public API
app.get("/api/restaurants/:loc", (req, res) => {

	let loc = req.params.loc;
	let start = req.query.start;
	let keyword = req.query.kw;

	axios.get(`https://developers.zomato.com/api/v2.1/locations?query=${loc}`, zomatoConfig)
		.then(result => {
			let location = result.data.location_suggestions[0];
			// console.log('location:', location)
			axios.get(`https://developers.zomato.com/api/v2.1/search?entity_id=${location.entity_id}&entity_type=${location.entity_type}&start=${start}&q=${keyword}`, zomatoConfig)
				.then(result => {
					// console.log('result.data:', result.data)
					let restaurants = result.data.restaurants;
					let total = result.data.results_found;
					let start = result.data.results_start;
					res.send({ location, total, start, restaurants });
				})
		})
})

// Handles react router and any requests that don't match the ones above
// app.get('*', (req, res) => {
// 	res.sendFile(__dirname + '/client/dist/index.html');
// });

app.listen(PORT, () => console.log(`server is listening on port ${PORT}...`))