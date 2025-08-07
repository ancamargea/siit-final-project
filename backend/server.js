const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

app.db = router.db;

app.use(cors());
app.use(middlewares);
app.use(auth);

// Force middleware after auth
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (req.body.storeId && typeof req.body.storeId === "string") {
      req.body.storeId = Number(req.body.storeId);
      console.log("✅ Coerced storeId to number");
    }

    if (req.body.userId && typeof req.body.userId === "string") {
      req.body.userId = Number(req.body.userId);
      console.log("✅ Coerced userId to number");
    }
  }
  next();
});

app.use(router);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`JSON Server with Auth is running on port ${PORT}`);
});
