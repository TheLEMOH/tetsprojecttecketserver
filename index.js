const express = require("express");
const history = require("connect-history-api-fallback");

const path = require("path");
const app = express();

const db = require("./db");

app.use(express.json());

const userRouters = require("./server/routers/user");
const organizationRouters = require("./server/routers/organization");
const category = require("./server/routers/category");
const area = require("./server/routers/area");
const way = require("./server/routers/way");
const login = require("./server/routers/login");
const ticket = require("./server/routers/ticket");
const priority = require("./server/routers/priority");
const status = require("./server/routers/status");
const system = require("./server/routers/system");
const message = require("./server/routers/message");
const roles = require("./server/routers/role");
const statistic = require("./server/routers/statistic");
const folder = require("./server/routers/folder");
const init = require("./server/routers/init");

app.use("/api", userRouters);
app.use("/api", organizationRouters);
app.use("/api", category);
app.use("/api", way);
app.use("/api", area);
app.use("/api", login);
app.use("/api", ticket);
app.use("/api", priority);
app.use("/api", status);
app.use("/api", system);
app.use("/api", message);
app.use("/api", roles);
app.use("/api", statistic);
app.use("/api", folder);
app.use("/api", init);

app.use((err, req, res, next) => {
  const errorText = err.toString();
  res.status(400).json({ message: errorText });
});

db.sync({ alter: true });
/* 
const staticFileMiddleware = express.static(path.join(__dirname + "/dist/"));
app.use(staticFileMiddleware);

app.use(
  history({
    disableDotRule: true,
    index: "/",
    rewrites: [{ from: /\/soccer/, to: "/index.html" }],
  })
);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
}); */

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Сервер запущен. Порт ${PORT}`);
});
