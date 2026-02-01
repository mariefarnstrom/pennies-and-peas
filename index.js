import express from 'express'
import path from 'path'
import url from 'url'

const app = express()
const port = 3000

app.use(express.json());

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, '/src', '/index.html')

app.get('/', (req, res) => {
    res.sendFile(filePath);
})

app.post('/income', (req, res) => {
    // POST data
    const body = req.body;

    console.log('Received POST /income with body:', body);

    // send JSON response
    res.status(200).json({
        message: 'POST request received',
        receivedData: body
    });
});

app.post('/expenses', (req, res) => {
    // POST data
    const body = req.body;

    console.log('Received POST /expenses with body:', body);

    // send JSON response
    res.status(200).json({
        message: 'POST request received',
        receivedData: body
    });
});

app.get('/summary', (req, res) => {
    res.status(200).json({
        message: 'Summary endpoint!'
    });
});

app.use(express.static('src/public'))

app.listen(port,() => {
    console.log(`Server listening at port ${port}.`)
})