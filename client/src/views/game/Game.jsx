import { useEffect, useMemo, useState } from "react";
import Canvas from "../../components/canvas/Canvas";

export default function Game({ socket }) {
  const playerColor = '#ffffff';
  const ballColor = '#ffffff';
  const backgroundColor = '#000000';
  const canvasWidth = 800;
  const canvasHeight = 400;
  const pointsFontSize = 30;

  const playerActions = {
    'w': () =>{
      socket.emit('movePlayer', { id: socket.id, direction: -1 });
    },
    's': () =>{
      socket.emit('movePlayer', { id: socket.id, direction: 1 });
    }
  }

  const [player1Points, setPlayer1Points] = useState(0);
  const [player2Points, setPlayer2Points] = useState(0);
  const [whoAmI, setWhoAmI] = useState(1);

  const [player1, setPlayer1] = useState({
    x: 20,
    y: 20,
    width: 10,
    height: 80,
    isMoving: false,
    moveDirection: 1,
  });

  const [player2, setPlayer2] = useState({
    x: canvasWidth - 20 - 10,
    y: 20,
    width: 10,
    height: 80,
    isMoving: false,
    moveDirection: 1,
  });

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

    socket.on('whoAmI', (data) => {
      const { player } = data;
      if(player === 1){
        setPlayer1({
          ...player1,
          x: 20,
        });

        setPlayer2({
          ...player2,
          x: canvasWidth - 20 - 10,
        });
      } else{
        setPlayer1({
          ...player1,
          x: canvasWidth - 20 - 10,
        });

        setPlayer2({
          ...player2,
          x: 20,
        });
      }

      setWhoAmI(player);
    });

    socket.on('ballPosition', (data) => {
      if(whoAmI){
        ball.x = data.x;
        ball.y = data.y;
      }else{
        ball.x = canvasWidth - data.x;
        ball.y = canvasHeight - data.y;
      }
    });

    socket.on('playerPosition', (data) => {
      if(data.id === socket.id){
        setPlayer1({
          ...player1,
          y: data.y,
        });
      }
      else{
        setPlayer2({
          ...player2,
          y: data.y,
        });
      }
    });

    socket.on('markPoint', (player) => {
      // console.log('Marcou ponto', player);
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
  }, [socket, ball, player1Points, player2Points, player1]);

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
    playerActions[event.key]();
  }

  function draw(ctx, _frameCount){
    clearCanvas(ctx);
    drawBackground(ctx);
    drawBall(ctx);
    drawPlayers(ctx);
    drawPoints(ctx);
    drawMiddleLine(ctx);
  }

  useEffect(() =>{
    window.addEventListener('keydown', movePlayer1);
    return () => {
      window.removeEventListener('keydown', movePlayer1);
    }
  });
  
  return (
    <div>
      <h1>Multiplayer Pong Game</h1>
      <p>Project developed for computer network discipline</p>
      <p>Developed by: Arthur, Antônio, Daniel and Max</p>
      <Canvas draw={draw} width={canvasWidth} height={canvasHeight}/>
    </div>
  );
}
