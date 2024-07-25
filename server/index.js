const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

const app = express();
const wss = new WebSocket.Server({ noServer: true });

app.use(express.json());
app.use(cors());

app.post("/webhook", (req, res) => {
  const data = req.body;
  // Broadcast data to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
  res.status(200).send("Data received");
});

const server = app.listen(8080, () =>
  console.log("Listening on http://localhost:8080")
);
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit("connection", socket, request);
  });
});
