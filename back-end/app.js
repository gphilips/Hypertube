const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressValidator = require("express-validator");
const CronJob = require("cron").CronJob;
const setPassportStrategies = require("./config/passport");
const routes = require("./routes");
const { cleanUnWatchedTorrent } = require("./controllers/torrent");
const cors = require("cors");
require("dotenv").config({ path: path.join(__dirname, "/config/.env") });

const app = express();

app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(expressValidator());

new CronJob(
	"0 0 * * *",
	() => cleanUnWatchedTorrent(),
	null,
	true,
	"Europe/Paris"
);

setPassportStrategies();

app.use("/api", routes);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DBURI, {
	useCreateIndex: true,
	useNewUrlParser: true
});
mongoose.set("useFindAndModify", false);

mongoose.connection.on("error", err => {
	console.error(err);
	console.log(
		"There is an error with MongoDB connection. Please make sure MongoDB is running."
	);
	process.exit();
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
