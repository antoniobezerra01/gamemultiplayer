# Ping Pong Multiplayer

## :octocat: Integrantes
[Max David](https://github.com/maxdavidsouza) | [Arthur Costa](https://github.com/arthur007110) | [Antonio Bezerra](https://github.com/antoniobezerra01) | [José Daniel](https://github.com/JoseDanielF)

## :page_with_curl: Sobre o Projeto
Projeto para implementação de um game online em React.js e Node.js com foco no cliente e servidor para a disciplina de __Rede de Computadores__ ministrado pela Professora Dr. Kádna Camboim, da UFAPE, referente ao período de 2022.1 com intuito de avaliação para a 2ª Verificação de Aprendizagem.

O projeto baseado no jogo Pong consiste em desenvolver um sistema que permita que dois jogadores possam jogar Pong em computadores diferentes, conectados através de uma rede de computadores. O projeto utiliza a tecnologia de socket para estabelecer a conexão entre os jogadores, permitindo que os dados sejam transmitidos em tempo real entre as máquinas. Cada jogador controla uma raquete no jogo e deve rebater a bola para o campo do adversário, marcando pontos quando a bola ultrapassa a raquete do oponente. Para implementar o projeto, é necessário desenvolver tanto o cliente quanto o servidor que irá se comunicar através dos sockets. O servidor será responsável por gerenciar a conexão entre os jogadores e coordenar a transmissão dos dados do jogo, enquanto o cliente será responsável por receber e enviar informações para o servidor e atualizar a interface gráfica do jogo.

### Acesse a Aplicação Aqui: http://ping-pong-ufape-redes-1075576976.us-east-1.elb.amazonaws.com:3000/

## :round_pushpin: Objetivos
Utilizar conceitos lecionados na disciplina de Rede de Computadores para criar uma aplicação que explora a comunicação entre redes em tempo real e desenvolver um jogo multiplayer online com temática do PONG com funcionalidades adicionais em sua lógica de jogo principal.

## :hammer_and_wrench: Tecnologias Usadas
### [React.js](https://react.dev/)
### [Node.js](https://nodejs.org/en)
### [Amazon AWS EC2 Server](https://aws.amazon.com)

## Rodando o client

Estando na pasta "client/" execute o comando `npm install` para instalar as dependências do projeto.\ 
Após isto rode o comando `npm start` para iniciar o projeto localmente.

## Rodando o server

Estando na pasta "server/" execute o comando `npm install` para instalar as dependências do projeto.\ 
Após isto rode o comando `npm start` para iniciar o projeto localmente.

## Comandos Essenciais (Biblioteca Socket.IO)

`socket.emit('nomeDaFuncao',dados);` //Utilizado para emitir mensagens para todos a partir de um socket do client-2-server ou server-2-client

`socket.emit('nomeDaFuncao',dados).to(outroSocketID);` //Utilizado para emitir mensagens específicas entre dois ou mais sockets

`socket.on('nomeDaFuncao', (dados) => {funcao});` //Utilizado para tratar mensagens do client ou do server

`socket.join('nomeDaSala',outroSocketID);` //Utilizado para juntar um socket à sala de broadcast de outro socket

`socket.leave('nomeDaSala',outroSocketID);` //Utilizado para remover um socket de uma sala de broadcast

`sockets.in('nomeDaSala');` ou `sockets.to('nomeDaSala');` //Utilizado para comunicar todos os sockets de uma sala (pode ser combinado com socket.emit e socket.on)

`sockets.leave('nomeDaSala');` //Utilizado para remover todos os sockets de uma sala de broadcast

É importante ressaltar que o Handshake pode ser aplicado ao utilizarmos um socket.emit dentro de um componente 'Client' para os sockets existentes dentro de uma URL, por exemplo, 'http://localhost:4000', sendo respondido pelo componente 'Server' através de um socket.on e um socket.emit, e atualizando a página do socket responsável pela comunicação inicial com a resposta final do servidor. Obs: o mesmo pode ser aplicado entre componentes do mesmo tipo 'Client-2-Client' e 'Server=2-Server'.

![Handshake](https://user-images.githubusercontent.com/89958956/231743908-1da1b25c-de94-447d-a70f-303e3c243852.png)
