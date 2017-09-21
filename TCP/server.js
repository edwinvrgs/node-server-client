const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var clients = [];

const server = net.createServer((client) => {

    client.name = client.remoteAddress + ":" + client.remotePort
    console.log('Client ' + client.name + ' connected');

    clients.push(client);

    client.write("You, you're the client number " + clients.length);
    broadcast(client.name + " joined the chat\n", client);

    client.on('data', (data) => {

        console.log(client.name + '> ' + data);

        if (data.toString('utf8').toLowerCase() == 'close') {
            client.write('See you, my pana');
            client.destroy();
        }

        broadcast(client.name + "> " + data.toString('utf8'), client);
    });

    client.on('end', () => {
        clients.splice(clients.indexOf(client), 1);
        console.log(client.name + ' disconnected.');
        broadcast(client.name + ' left the chat.\n');
    });

    function broadcast(message, sender) {
        clients.forEach((client) => {
            if (client === sender) return;
            client.write(message);
        });
    }

    client.pipe(client);
});

server.listen(1801);