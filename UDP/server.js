//Constantes (IP, PUERTO)
const constants = require('../constants');

//Librerias de nodejs 
const net = require('net');
const dgram = require('dgram');

//Creacion del servidor UDP
const serverUDP = dgram.createSocket('udp4');

//Función que se ejecuta despues de la creación del servidor
serverUDP.on('listening', () => {
    const address = serverUDP.address();
    console.log('Servidor UDP escuchando en ' + address.address + ":" + address.port);
});

//Función encargada de escuchar los mensajes por UDP
serverUDP.on('message', (message, remote) => {
	//Mensaje recibido
    console.log(remote.address + ':' + remote.port +' - ' + message);
	
	//Respuesta del servidor
    const response = 'Hola, estas conectandote a mi por UDP';
    serverUDP.send(response, 0, message.length, remote.port, remote.address, () => {
        console.log("Enviado por UDP: '" + response + "'");
    });
});

// Nota: todo el código a partir de esta línea tiene que ver con la conexión TCP

//Array para almacenar los diferentes clientes TCP
var clientsTCP = [];

//Creación del servidor TCP (esto para cada cliente que se conecte)
const serverTCP = net.Server((client) => {

	//Identificacion del cliente
    client.name = client.remoteAddress + ":" + client.remotePort
    console.log('Cliente ' + client.name + ' conectado');

	//Esto es por si acaso hay varias conexiones de un mismo cliente
    if(clientsTCP.includes(client))
        return;

	//Se agrega el cliente nuevo a la lista de clientes
    clientsTCP.push(client);

	//Mensaje para confirmar la conexión
    client.write("Hola mi pana, usted ha sido elegido para conversar a través de este medio");

	//Notificación a los demas clientes
    broadcast(client.name + " se ha unido a la sala\n", client);

	//Manejo de los mensajes entrantes
    client.on('data', (data) => {

        console.log(client.name + '> ' + data);
		
		//Comando de salida
        if (data.toString('utf8').toLowerCase() == 'close') {
            client.write('Nos vemos, líder');
            client.destroy();
        }
		
		//Se envía el mensaje a los demás clientes
        broadcast(client.name + "> " + data.toString('utf8'), client);
    });
	
	//Cierre de la conexión y notificación a los demas clientes
    client.on('end', () => {
        clientsTCP.splice(clientsTCP.indexOf(client), 1);
        console.log(client.name + ' desconectado');

		//Notificación a los demas clientes
        broadcast(client.name + ' ha dejado la sala\n');
    });

	//Cierre de la conexión en caso de un error
    client.on('error', (err) => console.log('La conexión con ' + client.remoteAddress + ":" + client.remotePort + ' se ha cerrado abruptamente'));
});

//Inicizalización de ambos servidores (UDP y TCP)
serverTCP.listen(constants.PORT);
serverUDP.bind(constants.PORT);

//Función para enviar un 'broadcast' por TCP
function broadcast(message, sender) {
    clientsTCP.forEach((client) => {
        if(client !== sender)
            client.write(message);
    });
}
