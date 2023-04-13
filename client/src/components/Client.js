import React, { useEffect, useState } from 'react';
import {io} from 'socket.io-client'
import ListaDeJogadores from './ListaDeJogadores';
import Chat from './Chat';
import ListaDeSalas from './ListaDeSalas';

const socket = io('http://localhost:4000');

//Criando o componente Pong de Jogo
const Client = () => {
    const [jogadores, setJogadores] = useState({});
    const [salas, setSalas] = useState({});
    const [mensagens, setMensagens] = useState('');
    
    //Método responsável por sinalizar ao cliente que ele foi conectado.
    useEffect(() => {
        socket.on('connect', () => {console.log('Conectado!');});
    }, [/* Dependencias (arquivos necessários para a execução do procedimento)*/]);

    //Método responsável por receber a atualização de clientes do servidor
    useEffect(() => {
        socket.on('atualizarClientes', (jogadores) => {setJogadores(jogadores)});
    }, [jogadores]);

    //Método responsável por receber do servidor a atualização da caixa de mensagens de todos os clientes
    useEffect(() => {
        socket.on('receberMensagem', (mensagemRecebida) => {
            setMensagens(mensagens + mensagemRecebida + '\n')});
    }, [mensagens]);

    //Método responsável por enviar do servidor a atualização de salas de jogo à todos os clientes
    useEffect(() => {
        socket.on('atualizarSalas', (salas) => {setSalas(salas)});
    }, [salas]);

    const enviarMensagem = (mensagem) => {
        //Envia a mensagem à todos somente se ela não for inválida
        if(!(!mensagem || /^\s*$/.test(mensagem)))
            socket.emit('enviarMensagem', mensagem);
    }

    const interagirSala = (sala) => {
        if(sala === "")
            socket.emit('criarSala', socket.id);
        else if(sala === "+")
            socket.emit('atualizarListaDeSalas');
        else
            socket.emit('acessarSala', sala);
    }

    return (
        //Criando uma tabela da lista de jogadores, lista de salas e um chat
        <div>
            <ListaDeJogadores jogadores={jogadores}/>
            <ListaDeSalas interagirSala={interagirSala} salas={salas}/>
            <Chat enviarMensagem={enviarMensagem} mensagens={mensagens}/>
        </div>
    );
};

export default Client;
