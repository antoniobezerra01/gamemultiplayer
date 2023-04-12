import React from 'react';
import './css/ListaDeJogadores.css'

//Criando o componente gráfico que representa a Lista de Jogadores do Jogo
const ListaDeJogadores = (props) => {
    return (
        <div class="caixa-jogadores">
            <h2 class='top-jogadores'>Jogadores no Servidor</h2>
            <div class="sub-caixa-jogadores">
            {Object.keys(props.jogadores).map((key) => (
                    <div class='item-jogadores' key={key}>{props.jogadores[key].nomeDoJogador}</div>
                ))
            }
            <div class='item-jogadores'>Novos jogadores aparecerão aqui</div>
            </div>
        </div>
    );
};

export default ListaDeJogadores;
