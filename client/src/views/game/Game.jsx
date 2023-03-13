import { useEffect, useMemo, useState } from "react";
import Canvas from "../../components/canvas/Canvas";

export default function Game({ socket }) {
  console.log('Meu id é:', socket);
  const playerColor = '#ffffff';
  const ballColor = '#ffffff';
  const backgroundColor = '#000000';
  const canvasWidth = 800;
  const canvasHeight = 400;
  const pointsFontSize = 30;
  const playerSpeed = 10;

  const [player1Points, setPlayer1Points] = useState(0);
  const [player2Points, setPlayer2Points] = useState(0);

  const player1 = useMemo(() => {
    return {
      x: 20,
      y: 20,
      width: 10,
      height: 80,
    }
  }, []);

  const player2 = useMemo(() => {
    return {
      x: canvasWidth - 20 - 10,
      y: 20,
      width: 10,
      height: 80,
    }
  }, []);

  const ball = useMemo(() => {
    return {
      x: 0,
      y: 0,
      moveRight: 1,
      moveDown: 1,
    }
  }, []);

  function drawPoints(ctx){
    ctx.font = `${pointsFontSize}px Arial`;
    ctx.fillStyle = '#ffffff';
    const middleDistance = 50;

    ctx.fillText(player1Points, canvasWidth/2 - middleDistance, 50);
    ctx.fillText(player2Points, canvasWidth/2 + middleDistance - pointsFontSize, 50);
  }

  function drawMiddleLine(ctx){
    const lineSize = 2;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.fillRect(canvasWidth/2 - lineSize, 0, lineSize, canvasHeight);
  }

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

    socket.on('markPoint', (player) => {
      console.log('Marcou ponto', player);
      if(player.id === socket.id){
        setPlayer1Points(player.points);
      }
      else{
        setPlayer2Points(player.points);
      }
    });

    socket.on('restartGame', () => {
      setPlayer1Points(0);
      setPlayer2Points(0);
    });
  }, [socket, ball, player1Points, player2Points]);

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
    drawPoints(ctx);
    drawMiddleLine(ctx);
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
