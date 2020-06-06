const express = require("express");
const formidableMiddleware = require('express-formidable');

const initTestMethods = require("./testAPI");
const configureAdminServiceListeners = require("./adminApi");
const configureDirectorServiceListeners = require("./directorApi");
const configureDoctorServiceListners = require("./doctorApi");
const configureSharedServiceListners = require("./sharedApi");

const app = express();
app.use(formidableMiddleware());

function startServer() {
	var port = process.argv[2];
	if (port === null) {
		port = 3000;
	}

	app.listen(port, () => {
		console.log("Server running on port " + port);
	});

	app.use(function (req, res, next) {
		// Can be used for logging data
		console.log('Time: ', Date.now());
		next();
	});

	initTestMethods(app);
	configureAdminServiceListeners(app);
	configureDirectorServiceListeners(app);
	configureDoctorServiceListners(app);
	configureSharedServiceListners(app);



	// app.get('/user/:id', function (req, res, next) {
	// 	// if the user ID is 0, skip to the next route
	// 	if (req.params.id === '0') next('route')
	// 	// otherwise pass the control to the next middleware function in this stack
	// 	else next()
	//   }, function (req, res, next) {
	// 	// send a regular response
	// 	res.send('regular')
	//   })
	  
	//   // handler for the /user/:id path, which sends a special response
	//   app.get('/user/:id', function (req, res, next) {
	// 	res.send('special')
	//   })

	app.get("/url", (req, res, next) => {
		res.json(["Tony","Lisa","Michael","Ginger","Food"]);
		next();
	});

	app.get("/url", (req, res) => {
		console.log(req.method);
	});
}

startServer();

