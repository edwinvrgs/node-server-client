var net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var client = new net.Socket();

client.connect(1801, '190.204.43.12', () => {
    console.log('Connected');
});

client.on('data', (data) => {

    console.log(data.toString('utf8'));

    if (data.toString('utf8').toLowerCase() == 'close') {
        client.write('See you, my pana');
        client.destroy();
    }
});

rl.on('line', (respuesta) => {
    client.write(respuesta);
}).on('close', () => {
    console.log('Input buffer closed!');
});

client.on('close', () => {
    console.log('Connection closed');
});