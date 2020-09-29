const express = require("express");
const path = require("path");

const app = express();
const http = require("http").createServer(app);
const socket = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (request, response) => {
  response.render("index.html");
});

let messages = [];

socket.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.emit("previousMessages", messages);

  socket.on("sendMessage", (data) => {
    messages.push(data);
    socket.broadcast.emit("receivedMessage", data);
  });
});

http.listen(3000);
