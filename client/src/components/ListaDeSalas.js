import React from 'react';
import './css/ListaDeSalas.css'

//Criando o componente gráfico que representa a Lista de Jogadores do Jogo
const ListaDeSalas = (props) => {
    return (
        <div class="caixa-salas">
            <h2 class='top-salas'>Salas de Jogo</h2>
            <div class="sub-caixa-salas">
            {Object.keys(props.salas).map((key) => (
                    <div class='item-salas' key={key}>
                        {props.salas[key].nomeDaSala} - {props.salas[key].qtdJogadores}/2
                        <button onClick={() => props.interagirSala(props.salas[key])}>Entrar</button>
                        <button onClick={() => props.sairDaSala(props.salas[key])}>Sair</button>
                    </div>
                ))
            }
            <div class="item-salas">Novas salas aparecerão aqui</div>
            </div>
            <button class='btn-iniciar-jogo'>Iniciar Jogo</button>
            <button class='btn-criar-sala' onClick={() => props.interagirSala("")}>Criar Sala</button>
            <button class='btn-atualizar-sala' onClick={() => props.interagirSala("+")}>Atualizar Lista de Salas</button>
        </div>
    );
};

export default ListaDeSalas;
