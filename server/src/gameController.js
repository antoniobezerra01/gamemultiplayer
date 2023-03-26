export default function gameController(io){
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

  function addPlayer(player){
    players.push(player);
  }

  function removePlayer(player){
    const index = players.findIndex((p) => p.id === player.id);
    players.splice(index, 1);
  }

  function markPoint(player, callback){
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

  gameLoop();

  return {
    addPlayer,
    removePlayer,
    markPoint,
    moveBall,
    restartGame,
  }
}
