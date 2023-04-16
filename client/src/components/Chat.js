import React, {useState} from 'react';
import './css/Chat.css';

//Criando o componente gráfico que representa a Lista de Jogadores do Jogo
const Chat = (props) => {
    const[mensagem, setMensagem] = useState('');
    let listaDeMensagens = props.mensagens.split("\n");

    const pressionarEnter = (event) => {
        if (event.key === 'Enter') {
          props.enviarMensagem(mensagem);
          setMensagem('');
        }
    };

    return (
        <div className='caixa-de-mensagens'>
            {listaDeMensagens.map((item) => {
                return (
                    <div className="item-mensagem" key={item}>{item}</div>
                )
            })}
            <input className='input-enviar-mensagem' maxLength={64} placeholder='Escreva sua mensagem aqui e tecle ENTER para enviar. (max: 64 caracteres)' type="text" value={mensagem} onChange={(e) => setMensagem(e.target.value)} onKeyDown={pressionarEnter}/>
            <button className='btn-enviar-mensagem' onClick={() => {props.enviarMensagem(mensagem); setMensagem('')}}>Enviar</button>
        </div>
    );
};

export default Chat;
