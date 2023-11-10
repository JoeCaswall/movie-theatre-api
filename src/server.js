const app = require("./app");
const { db } = require("../db/connection");
port = 3000;

app.listen(port, () => {
  db.sync();
  console.log(`Listening at http://localhost:${port}/`);
});
