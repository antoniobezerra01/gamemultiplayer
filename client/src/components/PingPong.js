import { useState } from "react";
import Canvas from './Canvas';

const PingPong = () => {
    const corDoJogador = '#ffffff', corDaBola = '#ffffff', corDoFundo = '#000000';
    const largura = 800, altura = 400, tamanhoDaFonte = 30;

    /*const [iniciarPartida, setIniciarPartida] = useState(false);
    const [reiniciarRound, setReiniciarRound] = useState(false);
    const [finalizarPartida, setFinalizarPartida] = useState(false);*/

    const [jogador1] = useState({
        x: 20,
        y: altura/2-(altura*0.1),
        largura: 10,
        altura: 80,
        pontos: 0,
        velocidade: 1,
    });

    const [jogador2] = useState({
        x: largura - 20 - 10,
        y: altura/2-(altura*0.1),
        largura: 10,
        altura: 80,
        pontos: 0,
        velocidade: 1,
    });

    const [bola] = useState({
        x: largura/2,
        y: altura/2,
        velocidade: 4,
        direcao: [0,0], 
        //Orientação para Calibrar a Movimentação e Colisões da Bola
        //[1,0] Direita 360 (0)º | [-1,0] Esquerda 180º
        //[1,1] Direita 45º | [1,-1] Direita 315º 
        //[-1,1] Esquerda 135º | [-1,-1] Esquerda 225º 
    });

    function limparCanvas(ctx){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    function desenharPontuacao(ctx){
        ctx.font = `${tamanhoDaFonte}px Arial`;
        ctx.fillStyle = '#ffffff';
        const distanciaMedia = largura * 0.05;
        if(jogador1.pontos > 9)
            jogador1.pontos = 0;
        if(jogador2.pontos > 9)
            jogador2.pontos = 0;
        ctx.fillText(jogador1.pontos, largura/2 - distanciaMedia, 40);
        ctx.fillText(jogador2.pontos, largura/2 + distanciaMedia - 20, 40);
    };

    //Aplique toda a Lógica de Jogo da Bola aqui
    function desenharBola(ctx){
        ctx.fillStyle = corDaBola;
        ctx.arc(bola.x, bola.y, 10, 0, 2*Math.PI);
        ctx.fill();

        //Teste básico de Movimentação
        if(bola.x >= largura){
            bola.x = largura/2;
            jogador1.pontos += 1;
        }
            
        else if(bola.x <= 0){
            bola.x = largura/2;
            jogador2.pontos += 1;
        }
            
        if (bola.x+bola.velocidade >= jogador2.x) {
            bola.direcao[0] = -1;
        } else if (bola.x-bola.velocidade <= jogador1.x+10) {
            bola.direcao[0] = 1;
        }
            
        if (bola.direcao[0] === 1) {
            bola.x += bola.velocidade;
        } else if (bola.direcao[0] === -1) {
            bola.x -= bola.velocidade;
        }

        if (bola.direcao[0] === 0) {
            bola.x += bola.velocidade;
        }
    };
    
    //Aplique toda a lógica de movimentação do Jogador aqui (utilize props para receber comandos do Client.js)
    function desenharJogador(ctx, jogador){
        ctx.fillStyle = corDoJogador;
        ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
    };
    
    function desenharJogadores(ctx){
        ctx.fillStyle = corDoJogador;
        ctx.beginPath();
        desenharJogador(ctx, jogador1);
        desenharJogador(ctx, jogador2);
    };
    
    function desenharDivisao(ctx){
        const tamanhoDaLinha = 2;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.fillRect(largura/2 - tamanhoDaLinha, 0, tamanhoDaLinha, altura);
    };
    
    function desenharCenario(ctx){
        ctx.fillStyle = corDoFundo;
        ctx.beginPath();
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };
    
    function desenharJogo(ctx, _frameCount){
        limparCanvas(ctx);
        desenharCenario(ctx);
        desenharBola(ctx);
        desenharJogadores(ctx);
        desenharPontuacao(ctx);
        desenharDivisao(ctx);
    };

    return (
        <div>
            <Canvas draw={desenharJogo} width={largura} height={altura}/>
        </div>
    );
};

export default PingPong;