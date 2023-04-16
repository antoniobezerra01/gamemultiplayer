import React from 'react';
import './css/ListaDeJogadores.css'

//Criando o componente gráfico que representa a Lista de Jogadores do Jogo
const ListaDeJogadores = (props) => {
    return (
        <div className="caixa-jogadores">
            <h2 className='top-jogadores'>Jogadores no Servidor</h2>
            <div className="sub-caixa-jogadores">
            {Object.keys(props.jogadores).map((key) => (
                    <div className='item-jogadores' key={key}>{props.jogadores[key].nomeDoJogador}</div>
                ))
            }
            <div className='item-jogadores'>Novos jogadores aparecerão aqui</div>
            </div>
        </div>
    );
};

export default ListaDeJogadores;
