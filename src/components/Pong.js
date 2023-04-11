import React, { useEffect, useState } from 'react';
import {io} from 'socket.io-client'
import ListaDeJogadores from './ListaDeJogadores';
import Chat from './Chat';

const socket = io('http://localhost:4000');

//Criando o componente Pong de Jogo
const Pong = () => {
    const [jogadores, setJogadores] = useState({});
    const [mensagens, setMensagens] = useState('');

    useEffect(() => {
        socket.on('connect', () => {console.log('Conectado!');});
    }, [/* Dependencias */]);

    useEffect(() => {
        socket.on('atualizarClientes', (jogadores) => {setJogadores(jogadores)});
    }, [jogadores]);

    useEffect(() => {
        socket.on('receberMensagem', (mensagemRecebida) => {
            setMensagens(mensagens + mensagemRecebida + '\n')});
      }, [mensagens]);

    const enviarMensagem = (mensagem) => {
        socket.emit('enviarMensagem', mensagem);
    }

    return (
        //Criando uma tabela da lista de jogadores
        <div>
            <ListaDeJogadores jogadores={jogadores}/>
            <Chat enviarMensagem={enviarMensagem} mensagens={mensagens}/>
        </div>
    );
};

export default Pong;
