import { useEffect, useMemo } from "react";
import Canvas from "../../components/canvas/Canvas";

export default function Game({ socket }) {
  const playerColor = '#ffffff';
  const ballColor = '#ffffff';
  const backgroundColor = '#000000';
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

  const ball = useMemo(() => {
    return {
      x: 0,
      y: 0,
      moveRight: 1,
      moveDown: 1,
    }
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('ballPosition', (data) => {
      ball.x = data.x;
      ball.y = data.y;
    });
  }, [socket, ball]);

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

  function draw(ctx, _frameCount){
    clearCanvas(ctx);
    drawBackground(ctx);
    drawBall(ctx);
    drawPlayers(ctx);
    window.addEventListener('keydown', movePlayer1);
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
