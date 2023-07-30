const express = require("express");
const cors = require("cors");

// Create the Express app
const app = express();
app.use(express.json());

// cors settings
const corsOptions = {
	origin: "http://localhost:4200",
};
app.use(cors(corsOptions));

const db = require("./models/index");
db.sequelizeInstance
	.sync()
	.then(() => {
		console.log("Database and tables created!");
	})
	.catch((err) => {
		console.error("Error creating database and tables:", err);
	});

const authController = require("./controller/authController");
app.use(authController);

app.get("/test", (req, res) => {
	return res.status(200).send({ message: "Test route works!" });
});

// Start the server
app.listen(3000, () => {
	console.log("Server started on port 3000");
});
