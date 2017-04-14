const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Server/client nodejs app');
console.log('1. Server');
console.log('2. Client');

rl.question('Choose a program to start: ', (respuesta) => {
    console.log(respuesta);
});