const constants = require('../constants');

const net = require('net');
const dgram = require('dgram');
const serverUDP = dgram.createSocket('udp4');

serverUDP.on('listening', () => {
    const address = serverUDP.address();
    console.log('Servidor UDP escuchando en ' + address.address + ":" + address.port);
});

serverUDP.on('message', (message, remote) => {
    console.log(remote.address + ':' + remote.port +' - ' + message);

    const response = 'Hola por UDP';
    serverUDP.send(response, 0, message.length, remote.port, remote.address, () => {
        console.log("Enviado por UDP: '" + response + "'");
    });
});

var clientsTCP = [];

const serverTCP = net.Server((client) => {

    client.name = client.remoteAddress + ":" + client.remotePort
    console.log('Cliente ' + client.name + ' conectado');

    if(clientsTCP.includes(client))
        return;

    clientsTCP.push(client);

    client.write("Hola mi pana, usted ha sido elegido para conversar a través de este medio");

    broadcast(client.name + " se ha unido a la sala\n", client);

    client.on('data', (data) => {

        console.log(client.name + '> ' + data);

        if (data.toString('utf8').toLowerCase() == 'close') {
            client.write('Nos vemos, líder');
            client.destroy();
        }

        broadcast(client.name + "> " + data.toString('utf8'), client);
    });

    client.on('end', () => {
        clientsTCP.splice(clientsTCP.indexOf(client), 1);
        console.log(client.name + ' desconectado');
        broadcast(client.name + ' ha dejado la sala\n');
    });

    client.on('error', (err) => console.log('La conexión con ' + client.remoteAddress + ":" + client.remotePort + ' se ha cerrado abruptamente'));
});

serverTCP.listen(constants.PORT);
serverUDP.bind(constants.PORT);

function broadcast(message, sender) {
    clientsTCP.forEach((client) => {
        if(client !== sender)
            client.write(message);
    });
}
