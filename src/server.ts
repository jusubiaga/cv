/**
 * Module dependencies.
 */
import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
import * as mongo from 'connect-mongo';
import * as flash from 'express-flash';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import expressValidator = require('express-validator');

const MongoStore = mongo(session);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' });


/**
 * Controllers (route handlers).
 */
import * as homeController from './controllers/home';
import * as userController from './controllers/user';
import * as apiController from './controllers/api';
import * as contactController from './controllers/contact';
import { TestController } from './controllers/test';
import { TestAPIController } from './controllers/api/test';
import { TaskAPIController } from './controllers/api/task';
import { ExamAPIController } from './controllers/api/exam';


/**
 * API keys and Passport configuration.
 */
import * as passportConfig from './config/passport';

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

mongoose.connection.on('error', () => {
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});



/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

const testController = new TestController();
// PAGES
app.get('/exams', testController.examList.bind(testController));
app.post('/test/create', testController.createTest.bind(testController));
app.get('/tests', testController.testList.bind(testController));
app.get('/test/home', testController.testHome.bind(testController));
app.post('/test/complete', testController.completeTest.bind(testController));
app.post('/test/start', testController.startTest.bind(testController));
app.post('/test/send', testController.sendTest.bind(testController));


// APIS (WIP)
// app.get('/api/v1/tests', testController.getAllTests.bind(testController));
// app.get('/api/v1/test/:id', testController.getTestById.bind(testController));

const testApiController = new TestAPIController();
app.post('/api/v1/tests', testApiController.createTest.bind(testApiController));
app.get('/api/v1/tests', testApiController.getAllTests.bind(testApiController));
app.get('/api/v1/tests/:id', testApiController.getTestById.bind(testApiController));
app.get('/api/v1/tests/:id/tasks', testApiController.getTestTasks.bind(testApiController));
app.get('/api/v1/tests/:id/responses', testApiController.getTestResponses.bind(testApiController));
app.post('/api/v1/tests/:id/responses', testApiController.submitTestResponses.bind(testApiController));
app.post('/api/v1/tests/:id/send', testApiController.sendTest.bind(testApiController));
app.post('/api/v1/tests/:id/start', testApiController.startTest.bind(testApiController));
app.post('/api/v1/tests/:id/complete', testApiController.completeTest.bind(testApiController));
const taskApiController = new TaskAPIController();
app.post('/api/v1/tasks', taskApiController.createTask.bind(taskApiController));
app.get('/api/v1/tasks', taskApiController.getAllTasks.bind(taskApiController));
app.get('/api/v1/tasks/:id', taskApiController.getTaskById.bind(taskApiController));
const examApiController = new ExamAPIController();
app.post('/api/v1/exams', examApiController.createExam.bind(examApiController));
app.get('/api/v1/exams', examApiController.getAllExams.bind(examApiController));
app.get('/api/v1/exams/:id', examApiController.getExamById.bind(examApiController));

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});


/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;