import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
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

const sockets = [];

const ball = {
  x: 0,
  y: 0,
  moveRight: 1,
  moveDown: 1,
}
const ballSpeed = 5;
const canvasWidth = 800;
const canvasHeight = 400;

function moveBall(){
  ball.x += ballSpeed * ball.moveRight;
  ball.y += ballSpeed * ball.moveDown;

  if(ball.x >= canvasWidth - 10){
    ball.moveRight = -1;
  }
  if(ball.x <= 10){
    ball.moveRight = 1;
  }
  if(ball.y >= canvasHeight - 10){
    ball.moveDown = -1;
  }
  if(ball.y <= 10){
    ball.moveDown = 1;
  }
}

function gameLoop(){
  moveBall();
  io.emit('ballPosition', ball);

  const timeout = setTimeout(gameLoop, 1000 / 60);

  // if(sockets.length === 0){
  //   clearTimeout(timeout);
  // }
}

io.on('connection', (socket) => {
  console.log('New client connected');
  sockets.push(socket);
  socket.on('disconnect', () => {
    console.log('Client disconnected');

    const index = sockets.indexOf(socket);
    sockets.splice(index, 1);
  });
});

gameLoop();