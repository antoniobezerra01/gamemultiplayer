import { useEffect } from "react";
import Canvas from "../../components/canvas/Canvas";

export default function Game() {

  const playerColor = '#ffffff';
  const ballColor = '#ffffff';
  const backgroundColor = '#000000';
  const ballSpeed = 3;
  const canvasWidth = 800;
  const canvasHeight = 400;

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

  function draw(ctx, _frameCount){
    clearCanvas(ctx);
    drawBackground(ctx);
    drawBall(ctx);
    drawPlayers(ctx);
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
