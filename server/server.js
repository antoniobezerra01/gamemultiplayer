import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

/*Descrição do núcleo de comunicação entre cliente-servidor*/
//Envio de mensagem aos sockets (envia para todos)
//sockets.emit('nomeDoProcedimento',dados);
//Tratamento de mensagem dos sockets (tratamento coletivo)
//sockets.on('nomeDoProcedimento',(dados) => {processo;});

const app = express();
app.use(cors());
const server = http.createServer(app);
const sockets = new Server(server,{cors: {origin: '*',},});
const porta = 4000;

//Mecanismos e Procedimentos de Jogo para o Cliente
const jogo = {jogadores : {}, salas : {}, partida : {}}; //objetos que compõem o jogo

const atualizarClientes = () => {
    //console.log('Atualizando a lista de jogadores de todos os clientes...', Object.keys(jogo.jogadores).length);
    sockets.emit('atualizarClientes',jogo.jogadores);
};

const enviarMensagemEntreClientes = (jogador, mensagem) => {
    //console.log('Atualizando a lista de mensagens de todos os clientes...');
    sockets.emit('receberMensagem',`Jogador (${jogador.nomeDoJogador}) ${mensagem}`);
};

const atualizarSalasDoServidor = () => {
    console.log('Atualizando a lista de salas de jogo de todos os clientes...', Object.keys(jogo.salas).length);
    sockets.emit('atualizarSalas',jogo.salas);
};

app.get('/',(req, res) => res.send('Servidor em Execução...'));

//Insere um cliente à lista de jogadores ao conectar-se
sockets.on('connection', (socket) => {
    console.log(`${socket.id} foi conectado.`);
    const nomeDoJogador = 'Jogador_' + (Object.keys(jogo.jogadores).length + 1);
    jogo.jogadores[socket.id] = {nomeDoJogador};
    atualizarClientes();
    enviarMensagemEntreClientes(jogo.jogadores[socket.id],'entrou no servidor.');

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

    socket.on('atualizarListaDeSalas', () => {
        atualizarSalasDoServidor();
    });

    //Permite a interação com salas privadas entre os jogadores do servidor
    socket.on('acessarSala', function (sala) {
        if(sala === "" || sala === socket.id){
            const nomeDaSala = 'Sala_do_' + jogo.jogadores[sala].nomeDoJogador;
            const identificacao = socket.id;
            const qtdJogadores = 1;
            jogo.salas[socket.id] = { nomeDaSala, identificacao, qtdJogadores };
            socket.join(sala);
            console.log(socket.id,' criou uma sala.','[id: ',jogo.salas[socket.id].identificacao,' | nome: ',jogo.salas[socket.id].nomeDaSala,']');
            enviarMensagemEntreClientes(jogo.jogadores[socket.id],'criou uma sala de jogo.');
            atualizarSalasDoServidor();
        }
        else {
            //Juntando uma única pessoa à sala criada
            if (sala.qtdJogadores === 1) {
                jogo.salas[sala.identificacao].qtdJogadores = 2;
                socket.join(sala);
                console.log(socket.id,' entrou na sala.',sala.identificacao);
                enviarMensagemEntreClientes(jogo.jogadores[socket.id],`entrou na ${sala.nomeDaSala}.`);
                atualizarSalasDoServidor();
            } 
            //Sala cheia
            else {
                console.log(socket.id,' nao consegue entrar na sala: ',sala.identificacao,' possui ',sala.qtdJogadores,' jogadores.');
                enviarMensagemEntreClientes(jogo.jogadores[socket.id],`não pode entrar na ${sala.nomeDaSala} por estar cheia.`);
                atualizarSalasDoServidor();
            }
        }
    });

});

server.listen(porta,() => {console.log(`Servidor executando na porta: ${porta}`)});