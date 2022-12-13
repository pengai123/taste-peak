const express = require("express")
const app = express()
const PORT = 3010

app.use(express.static("./dist"))

// Handles react router and any requests that don't match the ones above
app.get('*', (req, res) => {
	res.sendFile(__dirname + '/dist/index.html');
});

app.listen(PORT, () => console.log(`server is listening on port ${PORT}...`))