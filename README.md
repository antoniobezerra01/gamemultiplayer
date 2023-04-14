# Ping Pong Multiplayer

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

`sockets.in('nomeDaSala');` ou `sockets.to('nomeDaSala')` //Utilizado para se comunicar com todos os sockets de uma sala (pode ser combinado com socket.emit e socket.on)

`sockets.in('nomeDaSala').disconnectSockets();` //Utilizado para cortar a comunincação de todos os sockets de uma sala de broadcast

É importante ressaltar que o Handshake pode ser aplicado ao utilizarmos um socket.emit dentro de um componente 'Client' para os sockets existentes dentro de uma URL, por exemplo, 'http://localhost:4000', sendo respondido pelo componente 'Server' através de um socket.on e um socket.emit, e atualizando a página do socket responsável pela comunicação inicial com a resposta final do servidor. Obs: o mesmo pode ser aplicado entre componentes do mesmo tipo 'Client-2-Client' e 'Server=2-Server'.

![Handshake](https://user-images.githubusercontent.com/89958956/231743908-1da1b25c-de94-447d-a70f-303e3c243852.png)
