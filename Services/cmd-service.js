const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


module.exports.runMe = () =>{
    console.log("Here you can see how to do cmd app");

    const readline = require('node:readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question(`What's your name?`, name => {

        const cleanedName = name.trim().replace(/\s+/g, ' ');

        console.log(`Hi ${name}!`);
        console.log(`Hi 2${cleanedName}!`);

        rl.close();
    });
}
