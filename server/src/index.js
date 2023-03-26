import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

app.listen(PORT + 1, () => {
  console.log(`Server is running on port ${PORT + 1}`);
});

const gameController = game(io);

const sockets = [];

io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);
  if(sockets.length === 2){ 
    socket.emit('gameFull');
    return;
  }
  sockets.push(socket);
  socket.emit('whoAmI', { player: sockets.length });
  gameController.addPlayer({ id: socket.id, y: 0, points: 0 });

  socketController(socket);
});

function socketController(socket) {
  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);

    const index = sockets.findIndex((s) => s.id === socket.id);
    sockets.splice(index, 1);

    gameController.removePlayer({ id: socket.id });
  });

  socket.on('movePlayer', (data) => {
    gameController.movePlayer(data);
  });
}

// Serve statically build client from '../../client/build'
app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('/', (req, res) => {
  res.send(500).end();
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});