const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.listen(PORT, () => {
    console.log('server listening on port ' + PORT)
})