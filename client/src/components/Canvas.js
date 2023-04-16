import React from 'react';
import useCanvas from './CanvasHook';

const Canvas = props => {
  const { draw, ...rest } = props;
  const canvasRef = useCanvas(draw);
  requestAnimationFrame(draw);
  
  return <canvas ref={canvasRef} {...rest}/>;
}

export default Canvas;