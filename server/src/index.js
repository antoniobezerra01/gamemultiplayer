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

const players = [];

const ball = {
  x: 0,
  y: 0,
  moveRight: 1,
  moveDown: 1,
}
let ballSpeed = 5;
const canvasWidth = 800;
const canvasHeight = 400;

function markPoint(player){
  const index = players.findIndex((p) => p.id === player.id);
  players[index].points += 1;
  io.emit('markPoint', {
    id: players[index].id,
    points: players[index].points,
  });

  ballSpeed += 1;
}

function moveBall(){
  if(players.length < 2){
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight / 2;
    return;
  }

  ball.x += ballSpeed * ball.moveRight;
  ball.y += ballSpeed * ball.moveDown;

  if(ball.x >= canvasWidth - 10){
    ball.moveRight = -1;
    if(players[1]){
      markPoint(players[1]);
    }
  }
  if(ball.x <= 10){
    ball.moveRight = 1;
    if(players[0]){
      markPoint(players[0]);
    }
  }
  if(ball.y >= canvasHeight - 10){
    ball.moveDown = -1;
  }
  if(ball.y <= 10){
    ball.moveDown = 1;
  }
}

function restartGame(){
  ball.x = canvasWidth / 2;
  ball.y = canvasHeight / 2;
  players.forEach(function(player){
    player.points = 0;
  });
  ballSpeed = 5;

  io.emit('restartGame');
}

function gameLoop(){
  players.forEach(function(player){
    if(player.points === 5){
      io.emit('gameOver', player);
    }
  });

  moveBall();
  io.emit('ballPosition', ball);

  const timeout = setTimeout(gameLoop, 1000 / 60);

  // if(sockets.length === 0){
  //   clearTimeout(timeout);
  // }
}

io.on('connection', (socket) => {
  console.log('New client connected with id: ', socket.id);
  if(sockets.length === 2){ 
    socket.emit('gameFull');
    return;
  }
  sockets.push(socket);
  players.push({ id: socket.id, y: 0, points: 0 });


  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);

    const index = sockets.findIndex((s) => s.id === socket.id);
    sockets.splice(index, 1);

    const playerIndex = players.findIndex((p) => p.id === socket.id);
    players.splice(playerIndex, 1);

    restartGame();
  });
});

gameLoop();