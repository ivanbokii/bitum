var express = require('express')
  , http = require('http')
  , path = require('path')
  
  , routes = require('./routes')
  , setupSocketIO = require('./setupSocketIO')
  , setupNewsUpdater = require('./setupNewsUpdater');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

global.sockets = [];
setupSocketIO(server);
setupNewsUpdater();