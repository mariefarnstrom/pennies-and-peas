import express from 'express'
import path from 'path'
import url from 'url'
import expensesRouter from './routes/expensesRouter.js';
import incomesRouter from './routes/incomesRouter.js';
import summaryRouter from './routes/summaryRouter.js';
import { getAvailableMonths } from './utils/budgetUtils.js';




const app = express()
const port = 3000

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

app.use(express.static('public'));/*css*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use((req, res, next) => {
  res.locals.months = getAvailableMonths();
  next();
});


app.use('/expenses', expensesRouter);
app.use('/incomes', incomesRouter);
app.use('/summary', summaryRouter);


app.get('/', (req, res) => {
    res.render("index");
});

app.use(express.static('src/public'))

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.send('Internal Server Error');
});

app.listen(port,() => {
    console.log(`Server listening at port ${port}.`)
})