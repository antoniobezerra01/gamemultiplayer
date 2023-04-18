import React from 'react';
import './css/ListaDeSalas.css'

//Criando o componente gráfico que representa a Lista de Jogadores do Jogo
const ListaDeSalas = (props) => {

    function habilitarJogo() {
        if(!props.salas && props.salas.length === 0) {
            return false;
        }
        const salasArr = Object.keys(props.salas).map((key) => props.salas[key]);
        let sala = salasArr.find((sala) => {
            return sala.idDono === props.socketAtual;
        });
        return sala && sala.qtdJogadores === 2;
    }

    function desabilitarCriarSala(){
        for (let i in props.salas) {
            if(props.salas[i].idConvidado === props.socketAtual || props.salas[i].idDono === props.socketAtual)
                return true;
        }
        return false;
    }

    function desabilitarSairSala(){
        for (let i in props.salas) {
            if(props.salas[i].idConvidado === props.socketAtual || props.salas[i].idDono === props.socketAtual)
                return false;
        }
        return true;
    }

    function trocarContexto(){
        for (let i in props.salas) {
            if(props.salas[i].idDono === props.socketAtual)
                return "Fechar";
        }
        return "Sair";
    }

    return (
        <div className="caixa-salas">
            <h2 className='top-salas'>Salas de Jogo</h2>
            <div className="sub-caixa-salas">
            {Object.keys(props.salas).map((key) => (
                    <div className='item-salas' key={key}>
                        {props.salas[key].nomeDaSala} - {props.salas[key].qtdJogadores}/2
                        <button disabled={desabilitarCriarSala()} onClick={() => props.interagirSala(props.salas[key])}>Entrar</button>
                        <button disabled={desabilitarSairSala()} onClick={() => props.sairDaSala(props.salas[key])}>{trocarContexto()}</button>
                    </div>
                ))
            }
            <div className="item-salas">Novas salas aparecerão aqui</div>
            </div>
            <button className='btn-iniciar-jogo' disabled={!habilitarJogo()} onClick={() => props.iniciarJogo()}>Iniciar Jogo</button>
            <button className='btn-criar-sala' disabled={desabilitarCriarSala()} onClick={() => props.interagirSala("")}>Criar Sala</button>
            <button className='btn-atualizar-sala' onClick={() => props.interagirSala("+")}>Atualizar Lista de Salas</button>
        </div>
    );
};

export default ListaDeSalas;
