import { useEffect } from "react";
import Canvas from "../../components/canvas/Canvas";

export default function Game() {

  const playerColor = '#ffffff';
  const ballColor = '#ffffff';
  const backgroundColor = '#000000';
  const ballSpeed = 3;
  const canvasWidth = 800;
  const canvasHeight = 400;
  const playerSpeed = 10;

  const player1 = {
    x: 20,
    y: 20,
    width: 10,
    height: 80,
  };

  const player2 = {
    x: canvasWidth - 20 - 10,
    y: 20,
    width: 10,
    height: 80,
  };

  const ball = {
    x: 0,
    y: 0,
    moveRight: 1,
    moveDown: 1,
  }

  function moveBall(){
    ball.x += ballSpeed * ball.moveRight;
    ball.y += ballSpeed * ball.moveDown;

    if(ball.x >= canvasWidth - 10){
      ball.moveRight = -1;
      countPoints(player1Points + 1, player2Points);
    }

    if(ball.x <= 10){
      ball.moveRight = 1;
    }
    if(ball.y >= canvasHeight - 10){
      ball.moveDown = -1;
      countPoints(player1Points, player2Points + 1);
    }

    if(ball.y <= 10){
      ball.moveDown = 1;
    }
    if(ball.x >= player2.x && ball.y >= player2.y && ball.y <= player2.y + player2.height){
      ball.moveRight = -1;
    }
    if(ball.x <= player1.x + player1.width && ball.y >= player1.y && ball.y <= player1.y + player1.height){
      ball.moveRight = 1;
    }
  }

  function countPoints(player1, player2){
    player1Points = player1;
    player2Points = player2;
    ctx.fillText(player1, 10, 50);
    ctx.fillText(player2, canvasWidth - 10, 50);
  }

  //Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      moveBall();
    }, 1000 / 60);
    return () => clearInterval(interval);
  });

  function clearCanvas(ctx){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function drawBackground(ctx){
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function drawBall(ctx){
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, 2*Math.PI);
    ctx.fill();
  }

  function drawPlayer(ctx, player){
    ctx.fillStyle = playerColor;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  function drawPlayers(ctx){
    ctx.fillStyle = playerColor;
    ctx.beginPath();
    drawPlayer(ctx, player1);
    drawPlayer(ctx, player2);
  }

  function movePlayer1(event){
    if(event.key === 'w' && player1.y > 0){
      player1.y -= playerSpeed;
    }
    if(event.key === 's' && player1.y < canvasHeight - player1.height){
      player1.y += playerSpeed;
    }
  }

  function movePlayer2(event){
    if(event.key === 'ArrowUp' && player2.y > 0){
      player2.y -= playerSpeed;
    }
    if(event.key === 'ArrowDown' && player2.y < canvasHeight - player2.height){
      player2.y += playerSpeed;
    }
  }

  function draw(ctx, _frameCount){
    clearCanvas(ctx);
    drawBackground(ctx);
    drawBall(ctx);
    drawPlayers(ctx);
    countPoints(player1Points, player2Points);
    window.addEventListener('keydown', movePlayer1);
    window.addEventListener('keydown', movePlayer2);
  }
  
  return (
    <div>
      <h1>Multiplayer Pong Game</h1>
      <p>Project developed for computer network discipline</p>
      <p>Developed by: Arthur, Antônio, Daniel and Max</p>
      <Canvas draw={draw} width={canvasWidth} height={canvasHeight}/>
    </div>
  );
}
