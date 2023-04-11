import React from 'react';
import './css/ListaDeJogadores.css'

//Criando o componente gráfico que representa a Lista de Jogadores do Jogo
const ListaDeJogadores = (props) => {
    return (
        <div class="caixa-jogadores">
            <h1 class='top-jogadores'>Jogadores no Servidor</h1>
            {Object.keys(props.jogadores).map((key) => (
                    <div class='item-jogadores' key={key}>{props.jogadores[key].nomeDoJogador}</div>
                ))
            }
        </div>
    );
};

export default ListaDeJogadores;
