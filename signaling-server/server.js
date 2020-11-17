'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 8080;

const app = express();

app.get("/webrtc_streaming.js", function (req, res) {
  res.sendFile("webrtc_streaming.js", { root: __dirname });
});

app.get("/favicon.ico", function (req, res) {
  res.sendFile("favicon.ico", { root: __dirname });
});

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on("create_room", (room_id) => {
    console.log("New room with id: " + room_id);
    socket.join(room_id);
  });

  socket.on("join_room", (data) => {
    let room_id = data["room_id"];
    let offer = data["offer"];

    console.log("viewer joined to room " + room_id); // TODO: check if room is already created
    console.log(offer);

    socket.join(room_id);
    io.to(room_id).emit("viewer_need_offer", {"viewer_id": socket.id, "offer": offer}); // TODO: emit only for streamer
  });

  socket.on("offer_to_viewer", (data) => {
    let viewer_id = data["viewer_id"];
    let offer = data["offer"];
    socket.broadcast.to(viewer_id).emit('offer', offer);
  });
  
  socket.on('disconnect', () => console.log('Client disconnected'));
});
