import './App.css';
import Game from './views/game/Game';
import socketIO from 'socket.io-client';

const socket = socketIO('http://localhost:4000');
function App() {
  return (
    <div className="App">
      <Game socket={socket} />
    </div>
  );
}

export default App;
