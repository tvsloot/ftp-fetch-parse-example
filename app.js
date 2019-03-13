const config = require('./config');
const fs = require('fs');
const Client = require('ftp');
const xlsx = require('node-xlsx').default;

const client = new Client();

client.on('ready', () => {
    client.get('Stammdaten_01012019.xls', (err, stream) => {
        if (err) {
            console.warn(err);
        }

        stream.once('close', () => {
            client.end();
        });

        stream.pipe(fs.createWriteStream('temp/fetched.xls')
            .on('close', () => {
                const parsedData = xlsx.parse('temp/fetched.xls');
                const formattedData = JSON.stringify(parsedData, null, 2);
                console.log(formattedData);
            }));
    });
});

const options = {
    host: config.ppvInventory.host,
    user: config.ppvInventory.user,
    password: config.ppvInventory.password
};
client.connect(options);
