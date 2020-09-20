const express = require('express');
const formidableMiddleware = require('express-formidable');
const winston = require('winston');

const initTestMethods = require('./testAPI');
const configureAdminServiceListeners = require('./adminApi');
const configureDirectorServiceListeners = require('./directorApi');
const configureDoctorServiceListners = require('./doctorApi');
const configureSharedServiceListners = require('./sharedApi');

const app = express();
app.use(formidableMiddleware());

// process.on('uncaughtException', function (err) {
//     console.log(err);
// });

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.simple(),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'apiLogging.log', level: 'info' })
	]
});

function startServer() {
	var port = process.argv[2];
	if (port === null) {
		port = 3000;
	}

	app.listen(port, () => {
		logger.log('info', `  +++++++++++++++++++++++++++++++\n\
	EXPRESS SERVER STARTED\n\
	Running on port ${port}\n\
	Time: ${Date().toString()}\n\
	+++++++++++++++++++++++++++++++`);
	});

	app.use(function (req, res, next) {
		logger.log('info', `  -----------------------------------\n\
	Time: ${Date().toString()}\n\
	Req URL: ${req.originalUrl}\n\
	Req query: ${JSON.stringify(req.query)}\n\
	Req caller identity: ${req.headers.identity_name}\n\
	-----------------------------------`);
		next();
	});

	initTestMethods(app);
	configureAdminServiceListeners(app);
	configureDirectorServiceListeners(app);
	configureDoctorServiceListners(app);
	configureSharedServiceListners(app);

	app.get("/url", (req, res, next) => {
		res.json(["Tony","Lisa","Michael","Ginger","Food"]);
		next();
	});
}

startServer();

