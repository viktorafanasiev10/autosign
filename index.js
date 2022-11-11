const pkg = require('./package.json');
const gle = require("greenlock-express")
const Greenlock = require('greenlock');
const app = require("./express-app.js");
const store = require('./store')

const config = {
  mongoCoreUrl: 'mongodb://localhost:27017/?journal=true',
  mongoCoreDbName: 'dev-nethunt-api'
}

const options = {
  packageRoot: __dirname,
  configDir: "./greenlock.d",
  package: require("./package.json"),
  maintainerEmail: "viktor85a@gmail.com",
  // manager: store.create({
  //   dbUrl: config.mongoCoreUrl,
  //   dbName: config.mongoCoreDbName
  // }),
  store: require('le-store-mongoz').create(
    db.collection('le-accounts'),
    db.collection('le-certs')
  ),
  cluster: false,
  configFile: '~/.config/greenlock/manager.json'
};

gle.init(function getConfig() {
    return options;
  })
  .serve(httpsWorker);

const greenlock = Greenlock.create({
  ...options,
  notify: function(event, details) {
    if ('error' === event) {
      console.error(details);
    }
  }
});

function httpsWorker(server) {
  app.get("/", function(req, res) {
    res.end("Hello, Encrypted World!");
  });

  app.post("/add", function(req, res) {
    greenlock
      .add({
        subject: req.body.subject,
        altnames: [req.body.altnames]
      })
    res.json({ body: req.body});
  });

  server.serveApp(app);
}
