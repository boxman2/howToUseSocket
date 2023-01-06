import { Socket } from "dgram";
import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (res, req) => res.redirect("/"));

const handleListen = () => console.log("listening gaha");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  socket["nickname"] = "anonymous";
  sockets.push(socket);
  socket.on("close", () => {});
  socket.on("message", (message) => {
    const parsed = JSON.parse(message);
    console.log(parsed);
    switch (parsed.type) {
      case "message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}:${parsed.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = parsed.payload;
        break;
    }
  });
});

server.listen(3000, handleListen);
