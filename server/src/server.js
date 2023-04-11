import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
const server = http.createServer(app);
const sockets = new Server(server,{cors: {origin: '*',},});
const porta = 4000;
const jogo = {jogadores: {}}
const atualizarClientes = () => {sockets.emit('atualizarClientes',jogo.jogadores)};
const enviarMensagemEntreClientes = (jogador, mensagem) => {
    sockets.emit('receberMensagem',`Jogador (${jogador.nomeDoJogador}) ${mensagem}`)
};

app.get('/',(req, res) => res.send('Servidor em Execução...'));

//Insere um cliente à lista de jogadores ao conectar-se
sockets.on('connection', (socket) => {
    console.log(`${socket.id} foi conectado.`);
    const nomeDoJogador = 'Jogador_' + socket.id;
    jogo.jogadores[socket.id] = {nomeDoJogador};
    if(Object.keys(jogo.jogadores).length > 1)
        enviarMensagemEntreClientes(jogo.jogadores[socket.id],'entrou no servidor.');
    atualizarClientes();

    //Remove um cliente da lista de jogadores ao perder sua conexão
    socket.on('disconnect', () => {
        console.log(`${socket.id} foi desconectado.`);
        if(Object.keys(jogo.jogadores).length > 1)
            enviarMensagemEntreClientes(jogo.jogadores[socket.id],'saiu do servidor.');
        delete jogo.jogadores[socket.id];
        atualizarClientes();
    });

    //Permite a troca de mensagens entre os jogadores do servidor
    socket.on('enviarMensagem', (mensagem) => {
        enviarMensagemEntreClientes(jogo.jogadores[socket.id],': '+mensagem);
    });

});

server.listen(porta,() => {console.log(`Servidor executando na porta: ${porta}`)});