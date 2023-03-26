export default function gameController(io){
  const players = [];
  const ball = {
    x: 0,
    y: 0,
    moveRight: 1,
    moveDown: 1,
  }
  let started = false;

  let ballSpeed = 5;
  const neededPoints = 10;
  const canvasWidth = 800;
  const canvasHeight = 400;

  function addPlayer(player){
    players.push(player);

    if(players.length === 2){
      ball.x = canvasWidth / 2;
      ball.y = canvasHeight / 2;

      started = true;
      io.emit('startGame');
    }
  }

  function removePlayer(player){
    const index = players.findIndex((p) => p.id === player.id);
    players.splice(index, 1);

    restartGame();
  }

  function markPoint(player){
    const index = players.findIndex((p) => p.id === player.id);
    players[index].points += 1;
    io.emit('markPoint', {
      id: players[index].id,
      points: players[index].points,
    });

    ballSpeed += 1;
  }

  function checkWin(){
    players.forEach(function(player){
      if(player.points >= neededPoints){
        io.emit('gameOver', player);
        started = false;

        restartGame();
      }
    });
  }

  function moveBall(){
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
    started = false;

    io.emit('ballPosition', ball);
    io.emit('restartGame');
  }

  function gameLoop(){
    if(started) {
      moveBall();
      io.emit('ballPosition', ball);

      checkWin();
    }

    // Recursive call to gameLoop
    setTimeout(gameLoop, 1000 / 60);
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
