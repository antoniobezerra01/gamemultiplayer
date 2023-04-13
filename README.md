# Ping Pong Multiplayer

## Rodando o client

Estando na pasta "client/" execute o comando `npm install` para instalar as dependências do projeto.\ 
Após isto rode o comando `npm start` para iniciar o projeto localmente.

## Rodando o server

Estando na pasta "server/" execute o comando `npm install` para instalar as dependências do projeto.\ 
Após isto rode o comando `npm start` para iniciar o projeto localmente.

## Comandos Essenciais
socket.emit('nomeDaFuncao',dados); //Utilizado para emitir mensagens para todos a partir de um socket do client-2-server ou server-2-client
socket.emit('nomeDaFuncao',dados).to(outroSocketID); //Utilizado para emitir mensagens específicas entre dois ou mais sockets
socket.on('nomeDaFuncao', (dados) => {funcao}); //Utilizado para tratar mensagens do client ou do server (pode ser encadeado com socket.emit)
socket.join('nomeDaSala',outroSocketID); //Utilizado para juntar um socket à sala de broadcast de outro socket
socket.leave('nomeDaSala',outroSocketID); //Utilizado para remover um socket de uma sala de broadcast
sockets.in('nomeDaSala') //Utilizado para se comunicar com todos os sockets de uma sala (pode ser combinado com socket.emit e socket.on)
sockets.in('nomeDaSala').disconnectSockets(); //Utilizado para cortar a comunincação de todos os sockets de uma sala de broadcast
