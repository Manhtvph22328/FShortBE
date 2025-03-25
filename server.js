const express = require('express')
const app = express();

const hostname = 'localhost';
const port = 8017

app.get('/', function (req, res) {
    res.send('<h1>quy</h1>');
})

app.listen(port, hostname, () => {
    console.log(`chạy server thành công http://${hostname}:${port}/`);
})
