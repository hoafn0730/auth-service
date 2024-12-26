require('dotenv').config();

const app = require('./app');

const port = process.env.PORT;

const hostname = '' || 'localhost';

app.listen(port, hostname, () => {
    console.log(`App listening at http://${hostname}:${port}`);
});
