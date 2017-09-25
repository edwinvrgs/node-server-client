//Constantes (IP, PUERTO)
const constants = require('../constants');

//Librerias de nodejs 
const net = require('net');
const dgram = require('dgram');
const readline = require('readline');

//Creación de la interfaz de lectura y escritura por consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Creación de los clientes UDP y TCP
const clientUDP = dgram.createSocket("udp4");
const clientTCP = new net.Socket();

//Función que permite la ejecución del broadcast
clientUDP.bind(() => {
    clientUDP.setBroadcast(true);
    if(!clientTCP.destroyed)
       /* setInterval(*/broadcast()/*, 3000);*/
});

//Función que se ejecuta despues de la recepción de un mensaje UDP
clientUDP.on('message', (message, remote) => {
	//Despues de recibir el mensaje UDP se crea la conexión TCP con la información del emisor
    clientTCP.connect(remote.port, remote.address, () => {
        console.log('Cliente conectado por TCP');
    });
});

//Función que se ejecuta despues de la recepción de un mensaje TCP
clientTCP.on('data', (data) => {
	//Comando de salida
    if (data.toString('utf8').toLowerCase() === 'close') {
        clientTCP.write('Nos vemos, el mio');
        clientTCP.destroy();
    }
    console.log(data.toString('utf8'));
});

//Función que se ejecuta despues que se cierra la conexión TCP
clientTCP.on('close', () => {
    console.log('Conexión terminada');
});

//Función que se ejecuta despues que se cierra la conexión TCP (por error)
clientTCP.on('error', (err) => console.log('La conexión se ha cerrado abruptamente'));

rl.on('line', (respuesta) => {
    clientTCP.write(respuesta);
}).on('close', () => {
    console.log('Buffer de entrada cerrado');
});

//Función broadcast
function broadcast() {
    const message = new Buffer('Hola, me gustaría conectarme');
    clientUDP.send(message, 0, message.length, constants.PORT, constants.BROADCAST_IP);
}