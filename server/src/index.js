import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import game from './gameController.js';
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.listen(PORT);

const gameController = game(io);

const sockets = [];

io.on('connection', (socket) => {
  console.log('New client connected with id: ', socket.id);
  if(sockets.length === 2){ 
    socket.emit('gameFull');
    return;
  }
  sockets.push(socket);
  gameController.addPlayer({ id: socket.id, y: 0, points: 0 });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);

    const index = sockets.findIndex((s) => s.id === socket.id);
    sockets.splice(index, 1);

    gameController.removePlayer({ id: socket.id });

    gameController.restartGame();
  });
});
