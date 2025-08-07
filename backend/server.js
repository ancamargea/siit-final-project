const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

app.db = router.db;

app.use(cors());
app.use(middlewares);
app.use(jsonServer.bodyParser);

app.use(auth);

app.use((req, res, next) => {
  if (req.method === "POST" && req.path === "/reviews") {
    req.body.storeId = Number(req.body.storeId);
    req.body.userId = Number(req.body.userId);
    req.body.rating = Number(req.body.rating);
  }
  next();
});

app.use(router);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`JSON Server with Auth is running on port ${PORT}`);
});
