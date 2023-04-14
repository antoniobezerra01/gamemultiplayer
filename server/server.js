import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
const server = http.createServer(app);
const sockets = new Server(server,{cors: {origin: '*',},});
const porta = 4000;
const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

//Mecanismos e Procedimentos de Jogo para o Cliente
const jogo = {jogadores : {}, salas : {}}; //objetos que compõem o jogo

const atualizarClientes = () => {
    console.log('Jogadores existentes: ', Object.keys(jogo.jogadores).length);
    sockets.emit('atualizarClientes',jogo.jogadores);
};

const enviarMensagemEntreClientes = (jogador, mensagem) => {
    sockets.emit('receberMensagem',`Jogador (${jogador.nomeDoJogador}) ${mensagem}`);
};

const atualizarSalasDoServidor = () => {
    console.log('Salas de Jogo existentes: ', Object.keys(jogo.salas).length);
    sockets.emit('atualizarSalas',jogo.salas);
};

app.get('/',(req, res) => res.send('Servidor em Execução...'));

//Insere um cliente à lista de jogadores ao conectar-se
sockets.on('connection', (socket) => {
    console.log(`${socket.id} foi conectado.`);
    const nomeDoJogador = 'Jogador_' + alfabeto[Math.floor(Math.random() * alfabeto.length)];
    jogo.jogadores[socket.id] = {nomeDoJogador};
    atualizarClientes();
    enviarMensagemEntreClientes(jogo.jogadores[socket.id],'entrou no servidor.');

    //Remove um cliente da lista de jogadores ao perder sua conexão
    socket.on('disconnect', () => {
        console.log(`${socket.id} foi desconectado.`);
        if(Object.keys(jogo.jogadores).length > 1)
            enviarMensagemEntreClientes(jogo.jogadores[socket.id],'saiu do servidor.');
        if(Object.keys(jogo.salas).length >= 1){
            if(jogo.salas[socket.id]){
                console.log("o dono levou uma sala consigo.");
                sockets.in(jogo.salas[socket.id].nomeDaSala).disconnectSockets();
                delete jogo.salas[socket.id];
            }
        }
        delete jogo.jogadores[socket.id];
        atualizarClientes();
        atualizarSalasDoServidor();
    });

    //Permite a troca de mensagens entre os jogadores do servidor
    socket.on('enviarMensagem', (mensagem) => {
        enviarMensagemEntreClientes(jogo.jogadores[socket.id],': '+mensagem);
    });

    //Atualiza as Informações do Servidor sobre a Lista de Salas
    socket.on('atualizarListaDeSalas', () => {
        atualizarSalasDoServidor();
    });

    //Permite a criação de salas privadas entre os jogadores do servidor
    socket.on('criarSala', function () {
        const nomeDaSala = 'Sala_do_' + jogo.jogadores[socket.id].nomeDoJogador;
        const idDono = socket.id;
        const idConvidado = socket.id;
        const qtdJogadores = 1;
        jogo.salas[socket.id] = { nomeDaSala, idDono, idConvidado, qtdJogadores };
        socket.join(nomeDaSala);
        console.log(`${socket.id} criou uma sala. [id (dono): ${jogo.salas[socket.id].idDono} | id (convidado): ${jogo.salas[socket.id].idConvidado} | nome: ${jogo.salas[socket.id].nomeDaSala}],`);
        enviarMensagemEntreClientes(jogo.jogadores[socket.id],'criou uma sala de jogo.');
        atualizarSalasDoServidor();
    });

    //Permite a entrada em salas privadas entre os jogadores do servidor
    socket.on('acessarSala', function (sala) {
        //Juntando uma pessoa à sala criada e evitando que um jogador (dono ou convidado) reentre na sala
        if (sala.qtdJogadores === 1 && (sala.idDono != socket.id || sala.idConvidado != socket.id)) {
            jogo.salas[sala.idDono].idConvidado = socket.id;
            jogo.salas[sala.idDono].qtdJogadores = 2;
            socket.join(sala.nomeDaSala);
            console.log(jogo.salas[sala.idDono].idConvidado,' entrou na sala de: ',sala.idDono);
            enviarMensagemEntreClientes(jogo.jogadores[socket.id],`entrou na ${sala.nomeDaSala}.`);
            atualizarSalasDoServidor();
        } else {
            console.log(socket.id,' não consegue entrar na sala: ',sala.idDono,' | possui ',sala.qtdJogadores,' jogadores.');
            enviarMensagemEntreClientes(jogo.jogadores[socket.id],`não pode entrar na ${sala.nomeDaSala}.`);
            atualizarSalasDoServidor();
        }
    });

    socket.on('sairDaSala', function (sala) {
        //Caso o socket a sair da sala seja o Dono
        if(sala.idDono == socket.id){
            sockets.in(jogo.salas[sala.nomeDaSala]).disconnectSockets();
            jogo.salas[sala.idDono].qtdJogadores = 0;
            console.log(`${socket.id} fechou a sala. [id (dono): ${jogo.salas[socket.id].idDono}`);
            enviarMensagemEntreClientes(jogo.jogadores[socket.id],`destruiu a [${jogo.salas[sala.idDono].nomeDaSala}].`);
            delete jogo.salas[sala.idDono];
        }
        //Caso o socket a sair da sala seja o Convidado
        else if(sala.idConvidado == socket.id){
            socket.leave(jogo.salas[sala.nomeDaSala]);
            jogo.salas[sala.idDono].qtdJogadores = 1;
            console.log(`${socket.id} saiu da sala. [id (dono): ${jogo.salas[sala.idDono].idDono}`);
            enviarMensagemEntreClientes(jogo.jogadores[socket.id],`saiu da [${jogo.salas[sala.idDono].nomeDaSala}].`);
        }
        atualizarSalasDoServidor();
    });

    socket.on('iniciarJanelaDeJogo', function () {
        sockets.to(jogo.salas[socket.id].nomeDaSala).emit('iniciarJogo');
        console.log('Iniciando o jogo na sala [', jogo.salas[socket.id].nomeDaSala,']');
        atualizarSalasDoServidor();
    });

});

server.listen(porta,() => {console.log(`Servidor executando na porta: ${porta}`)});