import express from 'express'
import path from 'path'
import url from 'url'
import expensesRouter from './routes/expensesRouter.js';
import incomesRouter from './routes/incomesRouter.js';
import summaryRouter from './routes/summaryRouter.js';


const app = express()
const port = 3000

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

app.use(express.static('public'));/*css*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/expenses', expensesRouter);
app.use('/incomes', incomesRouter);
app.use('/summary', summaryRouter);

app.get('/', (req, res) => {
    res.render("index");
});


// const filePath = path.join(__dirname, '/src', '/index.html')

// app.get('/', (req, res) => {
//     res.sendFile(filePath);
// })

// app.post('/income', (req, res) => {
//     // POST data
//     const body = req.body;

//     console.log('Received POST /income with body:', body);

//     // send JSON response
//     res.status(200).json({
//         message: 'POST request received',
//         receivedData: body
//     });
// });

// app.post('/expenses', (req, res) => {
//     // POST data
//     const body = req.body;

//     console.log('Received POST /expenses with body:', body);

//     // send JSON response
//     res.status(200).json({
//         message: 'POST request received',
//         receivedData: body
//     });
// });

// app.get('/summary', (req, res) => {
//     res.status(200).json({
//         message: 'Summary endpoint!'
//     });
// });

// app.use(express.static('src/public'))

// app.listen(port,() => {
//     console.log(`Server listening at port ${port}.`)
// })

app.use(express.static('src/public'))

app.listen(port,() => {
    console.log(`Server listening at port ${port}.`)
})