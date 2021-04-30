const http = require("http");
const auth_server = require("./authentication-server.ts");
const app = require("./app");
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});

http
  .createServer(async (req, res) => {
    mediaServer.pipe(req, res);
  })
  .listen(3003, "127.0.0.1");
