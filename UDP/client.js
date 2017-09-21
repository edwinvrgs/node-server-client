const constants = require('../constants');

const net = require('net');
const dgram = require('dgram');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const clientUDP = dgram.createSocket("udp4");
const clientTCP = new net.Socket();

clientUDP.bind(() => {
    clientUDP.setBroadcast(true);

    if(!clientTCP.destroyed)
       /* setInterval(*/broadcast()/*, 3000);*/
});

clientUDP.on('message', (message, remote) => {
    clientTCP.connect(remote.port, remote.address, () => {
        console.log('Cliente conectado por TCP');
    });
});

clientTCP.on('data', (data) => {
    if (data.toString('utf8').toLowerCase() === 'close') {
        clientTCP.write('Nos vemos, el mio');
        clientTCP.destroy();
    }

    console.log(data.toString('utf8'));
});

clientTCP.on('close', () => {
    console.log('Conexión terminada');
});

clientTCP.on('error', (err) => console.log('La conexión se ha cerrado abruptamente'));

rl.on('line', (respuesta) => {
    clientTCP.write(respuesta);
}).on('close', () => {
    console.log('Buffer de entrada cerrado');
});

function broadcast() {
    const message = new Buffer('Hola, me gustaría conectarme');
    clientUDP.send(message, 0, message.length, constants.PORT, constants.BROADCAST_IP);
}