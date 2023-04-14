import React from 'react';
import './css/ListaDeSalas.css'

//Criando o componente gráfico que representa a Lista de Jogadores do Jogo
const ListaDeSalas = (props) => {
    function jogoPodeSerIniciado() {
        if(!props.salas && props.salas.length === 0) {
            return false;
        }
        const salasArr = Object.keys(props.salas).map((key) => props.salas[key]);
        let sala = salasArr.find((sala) => {
            return sala.idDono === props.socketAtual;
        });
        return sala && sala.qtdJogadores === 2;
    }

    return (
        <div className="caixa-salas">
            <h2 className='top-salas'>Salas de Jogo</h2>
            <div className="sub-caixa-salas">
            {Object.keys(props.salas).map((key) => (
                    <div className='item-salas' key={key}>
                        {props.salas[key].nomeDaSala} - {props.salas[key].qtdJogadores}/2
                        <button onClick={() => props.interagirSala(props.salas[key])}>Entrar</button>
                        <button onClick={() => props.sairDaSala(props.salas[key])}>Sair</button>
                    </div>
                ))
            }
            <div className="item-salas">Novas salas aparecerão aqui</div>
            </div>
            <button
                className='btn-iniciar-jogo'
                onClick={() => {props.iniciarJogo(true)}}
                disabled={!jogoPodeSerIniciado()}
            >Iniciar Jogo</button>
            <button className='btn-criar-sala' onClick={() => props.interagirSala("")}>Criar Sala</button>
            <button className='btn-atualizar-sala' onClick={() => props.interagirSala("+")}>Atualizar Lista de Salas</button>
        </div>
    );
};

export default ListaDeSalas;
